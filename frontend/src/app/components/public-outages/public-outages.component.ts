import { Component, OnInit } from '@angular/core';
import { OutagesService, Outage, OutageType } from '../../services/outages.service';
import { ZonesService, Zone } from '../../services/zones.service';

@Component({
  selector: 'app-public-outages',
  templateUrl: './public-outages.component.html',
  styleUrls: ['./public-outages.component.scss'],
})
export class PublicOutagesComponent implements OnInit {
  zones: Zone[] = [];
  outages: Outage[] = [];
  loading = false;
  error = '';

  filterZoneId: number | null = null;
  filterType: OutageType | '' = '';

  constructor(
    private outagesService: OutagesService,
    private zonesService: ZonesService,
  ) {}

  ngOnInit(): void {
    this.loadZones();
    this.loadOutages();
  }

  get totalOutages(): number {
    return this.outages.length;
  }

  get waterOutages(): number {
    return this.outages.filter((o) => o.type === 'WATER').length;
  }

  get electricityOutages(): number {
    return this.outages.filter((o) => o.type === 'ELECTRICITY').length;
  }

  loadZones() {
    this.zonesService.getPublicZones().subscribe({
      next: (zones) => (this.zones = zones),
      error: () => {},
    });
  }

  loadOutages() {
    this.loading = true;
    this.error = '';
    const zoneId = this.filterZoneId ?? undefined;
    const type = this.filterType || undefined;
    this.outagesService.getCurrent(zoneId, type as OutageType | undefined).subscribe({
      next: (outages) => {
        this.outages = outages;
        this.loading = false;
      },
      error: () => {
        this.error = "Impossible de charger les coupures";
        this.loading = false;
      },
    });
  }
}
