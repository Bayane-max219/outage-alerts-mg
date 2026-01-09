import { Component, OnInit } from '@angular/core';
import { ZonesService, Zone } from '../../services/zones.service';

@Component({
  selector: 'app-admin-zones',
  templateUrl: './admin-zones.component.html',
  styleUrls: ['./admin-zones.component.scss'],
})
export class AdminZonesComponent implements OnInit {
  zones: Zone[] = [];
  loading = false;
  error = '';
  success = '';

  newName = '';
  newCity = '';
  newIsActive = true;

  constructor(private readonly zonesService: ZonesService) {}

  ngOnInit(): void {
    this.loadZones();
  }

  loadZones(): void {
    this.loading = true;
    this.error = '';
    this.zonesService.getAllZones().subscribe({
      next: (zones) => {
        this.zones = zones;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des zones.';
        this.loading = false;
      },
    });
  }

  createZone(): void {
    if (!this.newName || !this.newCity) {
      this.error = 'Veuillez saisir le nom et la ville.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.zonesService
      .createZone({
        name: this.newName,
        city: this.newCity,
        isActive: this.newIsActive,
      })
      .subscribe({
        next: (zone) => {
          this.zones.push(zone);
          this.loading = false;
          this.success = 'Zone créée.';
          this.newName = '';
          this.newCity = '';
          this.newIsActive = true;
        },
        error: () => {
          this.loading = false;
          this.error = 'Erreur lors de la création de la zone.';
        },
      });
  }

  deleteZone(zone: Zone): void {
    if (!confirm(`Supprimer la zone ${zone.city} - ${zone.name} ?`)) {
      return;
    }

    this.zonesService.deleteZone(zone.id).subscribe({
      next: () => {
        this.zones = this.zones.filter((z) => z.id !== zone.id);
      },
      error: () => {
        this.error = 'Erreur lors de la suppression de la zone.';
      },
    });
  }
}
