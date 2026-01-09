import { Component, OnInit } from '@angular/core';
import { OutagesService, Outage } from '../../services/outages.service';

@Component({
  selector: 'app-agent-outage-list',
  templateUrl: './agent-outage-list.component.html',
  styleUrls: ['./agent-outage-list.component.scss'],
})
export class AgentOutageListComponent implements OnInit {
  outages: Outage[] = [];
  loading = false;
  error = '';

  constructor(private readonly outagesService: OutagesService) {}

  ngOnInit(): void {
    this.loadOutages();
  }

  loadOutages(): void {
    this.loading = true;
    this.error = '';
    this.outagesService.getCurrent().subscribe({
      next: (data) => {
        this.outages = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des coupures.';
        this.loading = false;
      },
    });
  }

  deleteOutage(outage: Outage): void {
    if (!confirm(`Supprimer la coupure pour la zone ${outage.zone?.name} ?`)) {
      return;
    }

    this.outagesService.delete(outage.id).subscribe({
      next: () => {
        this.outages = this.outages.filter((o) => o.id !== outage.id);
      },
      error: () => {
        this.error = 'Erreur lors de la suppression de la coupure.';
      },
    });
  }
}
