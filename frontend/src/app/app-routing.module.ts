import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicOutagesComponent } from './components/public-outages/public-outages.component';
import { OutageDetailComponent } from './components/outage-detail/outage-detail.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { LoginComponent } from './components/login/login.component';
import { AgentOutageListComponent } from './components/agent-outage-list/agent-outage-list.component';
import { AgentOutageFormComponent } from './components/agent-outage-form/agent-outage-form.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminZonesComponent } from './components/admin-zones/admin-zones.component';
import { AdminSubscriptionsComponent } from './components/admin-subscriptions/admin-subscriptions.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', component: PublicOutagesComponent },
  { path: 'outages/:id', component: OutageDetailComponent },
  { path: 'subscribe', component: SubscriptionComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'agent',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['AGENT', 'ADMIN'] },
    children: [
      { path: 'outages', component: AgentOutageListComponent },
      { path: 'outages/new', component: AgentOutageFormComponent },
      { path: 'outages/:id/edit', component: AgentOutageFormComponent },
      { path: '', redirectTo: 'outages', pathMatch: 'full' },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'zones', component: AdminZonesComponent },
      { path: 'subscriptions', component: AdminSubscriptionsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
