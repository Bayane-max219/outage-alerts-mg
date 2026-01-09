import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OutagesService, Outage } from '../../services/outages.service';

@Component({
  selector: 'app-outage-detail',
  templateUrl: './outage-detail.component.html',
  styleUrls: ['./outage-detail.component.scss'],
})
export class OutageDetailComponent implements OnInit {
  outage: Outage | null = null;
  loading = false;
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly outagesService: OutagesService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (!id) {
      this.error = 'Identifiant de coupure invalide';
      return;
    }

    this.loading = true;
    this.outagesService.getOne(id).subscribe({
      next: (outage) => {
        this.outage = outage;
        this.loading = false;
      },
      error: () => {
        this.error = "Impossible de charger la coupure";
        this.loading = false;
      },
    });
  }
}
