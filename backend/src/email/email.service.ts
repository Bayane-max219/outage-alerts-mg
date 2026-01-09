import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Outage } from '../outages/outage.entity';
import { OutageType } from '../outages/outage-type.enum';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  private getTransporter(): nodemailer.Transporter | null {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
      this.logger.warn(
        'SMTP configuration is incomplete (SMTP_HOST / SMTP_USER / SMTP_PASS); emails will not be sent.',
      );
      return null;
    }

    if (!this.transporter) {
      const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
      const secure = process.env.SMTP_SECURE === 'true';

      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
      });
    }

    return this.transporter;
  }

  async sendOutageNotification(outage: Outage, to: string): Promise<void> {
    const transporter = this.getTransporter();
    if (!transporter) {
      return;
    }

    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const zoneName = outage.zone?.name ?? 'Zone inconnue';
    const city = outage.zone?.city ?? '';
    const typeLabel =
      outage.type === OutageType.WATER ? "d'eau" : "d'électricité";
    const subject = `Coupure ${typeLabel} – ${zoneName} (${city})`;

    const start = outage.startTime
      ? outage.startTime.toLocaleString('fr-FR')
      : 'Non précisée';
    const end = outage.endTimeEstimated
      ? outage.endTimeEstimated.toLocaleString('fr-FR')
      : 'Non précisée';

    const lines = [
      'Bonjour,',
      '',
      `Une coupure ${typeLabel} est prévue dans votre zone.`,
      '',
      `Zone : ${zoneName} (${city})`,
      `Début : ${start}`,
      `Fin estimée : ${end}`,
      '',
      outage.description ? `Détails : ${outage.description}` : '',
      '',
      'Ceci est un message automatique de la plateforme officielle JIRAMA.',
    ].filter(Boolean);

    const text = lines.join('\n');

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
    });

    this.logger.log(
      `Email de notification de coupure envoyé à ${to} pour la zone ${zoneName}`,
    );
  }
}
