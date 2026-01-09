import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../config';
import { AuthService } from './auth.service';

export interface Zone {
  id: number;
  name: string;
  city: string;
  isActive: boolean;
}

@Injectable({ providedIn: 'root' })
export class ZonesService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getPublicZones() {
    return this.http.get<Zone[]>(`${API_BASE_URL}/zones/public`);
  }

  getAllZones() {
    return this.http.get<Zone[]>(`${API_BASE_URL}/zones`, {
      headers: this.authHeaders(),
    });
  }

  createZone(payload: Partial<Zone>) {
    return this.http.post<Zone>(`${API_BASE_URL}/zones`, payload, {
      headers: this.authHeaders(),
    });
  }

  updateZone(id: number, payload: Partial<Zone>) {
    return this.http.patch<Zone>(`${API_BASE_URL}/zones/${id}`, payload, {
      headers: this.authHeaders(),
    });
  }

  deleteZone(id: number) {
    return this.http.delete<void>(`${API_BASE_URL}/zones/${id}`, {
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
