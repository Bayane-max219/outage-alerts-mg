import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  OutagesService,
  Outage,
  OutageStatus,
  OutageType,
} from '../../services/outages.service';
import { ZonesService, Zone } from '../../services/zones.service';

@Component({
  selector: 'app-agent-outage-form',
  templateUrl: './agent-outage-form.component.html',
  styleUrls: ['./agent-outage-form.component.scss'],
})
export class AgentOutageFormComponent implements OnInit {
  isEditMode = false;
  outageId?: number;

  zones: Zone[] = [];

  type: OutageType = 'ELECTRICITY';
  zoneId: number | null = null;
  startTime = '';
  endTimeEstimated = '';
  description = '';
  status: OutageStatus = 'PLANNED';

  loading = false;
  error = '';
  success = '';

  constructor(
    private readonly outagesService: OutagesService,
    private readonly zonesService: ZonesService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.loadZones();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.outageId = Number(idParam);
      this.loadOutage(this.outageId);
    }
  }

  loadZones(): void {
    this.zonesService.getAllZones().subscribe({
      next: (zones) => (this.zones = zones),
      error: () => {},
    });
  }

  loadOutage(id: number): void {
    this.outagesService.getOne(id).subscribe({
      next: (outage: Outage) => {
        this.type = outage.type;
        this.zoneId = outage.zone?.id ?? null;
        this.startTime = this.toLocalInputValue(outage.startTime);
        this.endTimeEstimated = outage.endTimeEstimated
          ? this.toLocalInputValue(outage.endTimeEstimated)
          : '';
        this.description = outage.description || '';
        this.status = outage.status;
      },
      error: () => {
        this.error = "Impossible de charger la coupure";
      },
    });
  }

  private toLocalInputValue(iso: string): string {
    const d = new Date(iso);
    // Format YYYY-MM-DDTHH:mm for datetime-local input
    const pad = (n: number) => String(n).padStart(2, '0');
    const year = d.getFullYear();
    const month = pad(d.getMonth() + 1);
    const day = pad(d.getDate());
    const hours = pad(d.getHours());
    const minutes = pad(d.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  submitCreate(): void {
    if (!this.zoneId || !this.startTime) {
      this.error = 'Veuillez renseigner au moins la zone et la date de début.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const startIso = new Date(this.startTime).toISOString();
    const endIso = this.endTimeEstimated
      ? new Date(this.endTimeEstimated).toISOString()
      : undefined;

    this.outagesService
      .create({
        type: this.type,
        zoneId: this.zoneId,
        startTime: startIso,
        endTimeEstimated: endIso,
        status: this.status,
        description: this.description || undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Coupure créée avec succès.';
          this.router.navigate(['/agent/outages']);
        },
        error: () => {
          this.loading = false;
          this.error = 'Erreur lors de la création de la coupure.';
        },
      });
  }

  submitEdit(): void {
    if (!this.outageId || !this.zoneId || !this.startTime) {
      this.error =
        'Veuillez renseigner au moins la zone et la date de début.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const startIso = new Date(this.startTime).toISOString();
    const endIso = this.endTimeEstimated
      ? new Date(this.endTimeEstimated).toISOString()
      : undefined;

    this.outagesService
      .update(this.outageId, {
        type: this.type,
        zoneId: this.zoneId,
        startTime: startIso,
        endTimeEstimated: endIso,
        status: this.status,
        description: this.description || undefined,
      })
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Coupure mise à jour.';
          this.router.navigate(['/agent/outages']);
        },
        error: () => {
          this.loading = false;
          this.error = "Erreur lors de la mise à jour de la coupure.";
        },
      });
  }
}
