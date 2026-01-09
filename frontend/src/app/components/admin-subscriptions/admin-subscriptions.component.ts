import { Component, OnInit } from '@angular/core';
import {
  AdminSubscription,
  SubscriptionsService,
} from '../../services/subscriptions.service';

@Component({
  selector: 'app-admin-subscriptions',
  templateUrl: './admin-subscriptions.component.html',
  styleUrls: ['./admin-subscriptions.component.scss'],
})
export class AdminSubscriptionsComponent implements OnInit {
  subscriptions: AdminSubscription[] = [];
  loading = false;
  error = '';

  constructor(
    private readonly subscriptionsService: SubscriptionsService,
  ) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.loading = true;
    this.error = '';
    this.subscriptionsService.findAll().subscribe({
      next: (items) => {
        this.subscriptions = items;
        this.loading = false;
      },
      error: () => {
        this.error =
          "Erreur lors du chargement des abonnements. Vérifiez que vous êtes connecté en tant qu'administrateur.";
        this.loading = false;
      },
    });
  }
}
