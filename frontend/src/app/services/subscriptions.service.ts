import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../config';
import { AuthService } from './auth.service';
import { Zone } from './zones.service';

export interface AdminSubscription {
  id: number;
  userEmail: string;
  zone: Zone;
}

@Injectable({ providedIn: 'root' })
export class SubscriptionsService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  create(payload: { userEmail: string; zoneId: number }) {
    return this.http.post(`${API_BASE_URL}/subscriptions`, payload);
  }

  findAll() {
    return this.http.get<AdminSubscription[]>(`${API_BASE_URL}/subscriptions`, {
      headers: this.authHeaders(),
    });
  }

  private authHeaders(): HttpHeaders {
    const token = this.auth.getToken();
    return new HttpHeaders(
      token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    );
  }
}
