import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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

@NgModule({
  declarations: [
    AppComponent,
    PublicOutagesComponent,
    OutageDetailComponent,
    SubscriptionComponent,
    LoginComponent,
    AgentOutageListComponent,
    AgentOutageFormComponent,
    AdminDashboardComponent,
    AdminUsersComponent,
    AdminZonesComponent,
    AdminSubscriptionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
