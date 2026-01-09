import { Component, OnInit } from '@angular/core';
import { ZonesService, Zone } from '../../services/zones.service';
import { SubscriptionsService } from '../../services/subscriptions.service';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  zones: Zone[] = [];
  selectedZoneId: number | null = null;
  userEmail = '';

  loading = false;
  error = '';
  success = '';

  constructor(
    private readonly zonesService: ZonesService,
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  ngOnInit(): void {
    this.zonesService.getPublicZones().subscribe({
      next: (zones) => (this.zones = zones),
      error: () => {
        this.error = "Impossible de charger les zones";
      },
    });
  }

  submit() {
    this.error = '';
    this.success = '';

    if (!this.userEmail || !this.selectedZoneId) {
      this.error = 'Veuillez renseigner un email et une zone.';
      return;
    }

    this.loading = true;
    this.subscriptionsService
      .create({ userEmail: this.userEmail, zoneId: this.selectedZoneId })
      .subscribe({
        next: () => {
          this.loading = false;
          this.success =
            "Abonnement enregistré. Vous recevrez des notifications lors de nouvelles coupures.";
          this.userEmail = '';
          this.selectedZoneId = null;
        },
        error: () => {
          this.loading = false;
          this.error = "Erreur lors de l'abonnement.";
        },
      });
  }
}
