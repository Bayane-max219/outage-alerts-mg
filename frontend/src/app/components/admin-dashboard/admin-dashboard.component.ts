import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ZonesService } from '../../services/zones.service';
import { OutagesService } from '../../services/outages.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  loading = false;
  error = '';

  usersCount = 0;
  zonesCount = 0;
  currentOutagesCount = 0;
  historyOutagesCount = 0;

  constructor(
    private readonly usersService: UsersService,
    private readonly zonesService: ZonesService,
    private readonly outagesService: OutagesService,
  ) {}

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading = true;
    this.error = '';

    forkJoin([
      this.usersService.findAll(),
      this.zonesService.getAllZones(),
      this.outagesService.getCurrent(),
      this.outagesService.getHistory(),
    ]).subscribe({
      next: ([users, zones, current, history]) => {
        this.usersCount = users.length;
        this.zonesCount = zones.length;
        this.currentOutagesCount = current.length;
        this.historyOutagesCount = history.length;
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement des statistiques.';
        this.loading = false;
      },
    });
  }
}
