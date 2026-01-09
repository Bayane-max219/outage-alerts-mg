import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, LessThanOrEqual, Repository } from 'typeorm';
import { Outage } from './outage.entity';
import { Zone } from '../zones/zone.entity';
import { CreateOutageDto } from './dto/create-outage.dto';
import { UpdateOutageStatusDto } from './dto/update-outage-status.dto';
import { UpdateOutageDto } from './dto/update-outage.dto';
import { OutageStatus } from './outage-status.enum';
import { OutageType } from './outage-type.enum';
import { SubscriptionsService } from '../subscriptions/subscriptions.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class OutagesService {
  constructor(
    @InjectRepository(Outage)
    private readonly outagesRepository: Repository<Outage>,
    @InjectRepository(Zone)
    private readonly zonesRepository: Repository<Zone>,
    private readonly subscriptionsService: SubscriptionsService,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateOutageDto): Promise<Outage> {
    const zone = await this.zonesRepository.findOne({
      where: { id: dto.zoneId },
    });
    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    const outage = this.outagesRepository.create({
      type: dto.type,
      zone,
      startTime: new Date(dto.startTime),
      endTimeEstimated: dto.endTimeEstimated
        ? new Date(dto.endTimeEstimated)
        : null,
      status: dto.status || OutageStatus.PLANNED,
      description: dto.description ?? null,
    });

    const saved = await this.outagesRepository.save(outage);
    await this.notifySubscribers(saved);
    return saved;
  }

  findOne(id: number): Promise<Outage | null> {
    return this.outagesRepository.findOne({ where: { id } });
  }

  async getCurrent(zoneId?: number, type?: OutageType): Promise<Outage[]> {
    const where: any = {
      status: In([OutageStatus.PLANNED, OutageStatus.ONGOING]),
    };

    if (zoneId) {
      where.zone = { id: zoneId };
    }

    if (type) {
      where.type = type;
    }

    return this.outagesRepository.find({ where });
  }

  async getHistory(zoneId?: number, type?: OutageType): Promise<Outage[]> {
    const where: any = {};

    if (zoneId) {
      where.zone = { id: zoneId };
    }

    if (type) {
      where.type = type;
    }

    return this.outagesRepository.find({ where });
  }

  async updateStatus(id: number, dto: UpdateOutageStatusDto): Promise<Outage> {
    const outage = await this.findOne(id);
    if (!outage) {
      throw new NotFoundException('Outage not found');
    }
    outage.status = dto.status;
    return this.outagesRepository.save(outage);
  }

  async update(id: number, dto: UpdateOutageDto): Promise<Outage> {
    const outage = await this.findOne(id);
    if (!outage) {
      throw new NotFoundException('Outage not found');
    }

    const zone = await this.zonesRepository.findOne({ where: { id: dto.zoneId } });
    if (!zone) {
      throw new NotFoundException('Zone not found');
    }

    outage.type = dto.type;
    outage.zone = zone;
    outage.startTime = new Date(dto.startTime);
    outage.endTimeEstimated = dto.endTimeEstimated
      ? new Date(dto.endTimeEstimated)
      : null;
    outage.status = dto.status ?? outage.status;
    outage.description = dto.description ?? null;

    const saved = await this.outagesRepository.save(outage);
    await this.notifySubscribers(saved);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const outage = await this.findOne(id);
    if (!outage) {
      throw new NotFoundException('Outage not found');
    }
    await this.outagesRepository.remove(outage);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async autoCloseExpiredOutages() {
    const now = new Date();

    const outages = await this.outagesRepository.find({
      where: {
        endTimeEstimated: LessThanOrEqual(now),
        status: In([OutageStatus.PLANNED, OutageStatus.ONGOING]),
      },
    });

    if (outages.length === 0) {
      return;
    }

    outages.forEach((outage) => {
      outage.status = OutageStatus.RESTORED;
    });

    await this.outagesRepository.save(outages);
  }

  private async notifySubscribers(outage: Outage) {
    if (!outage.zone || !outage.zone.id) {
      return;
    }

    const subscriptions = await this.subscriptionsService.findByZoneId(
      outage.zone.id,
    );

    if (!subscriptions.length) {
      return;
    }

    await Promise.all(
      subscriptions.map((subscription) =>
        this.emailService
          .sendOutageNotification(outage, subscription.userEmail)
          .catch((error) => {
            // On log l'erreur mais on n'empêche pas les autres envois
            console.error(
              `Erreur lors de l'envoi de l'email à ${subscription.userEmail} pour la zone ${outage.zone.name}`,
              error,
            );
          }),
      ),
    );
  }
}
