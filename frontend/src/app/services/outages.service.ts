import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { API_BASE_URL } from '../config';
import { AuthService } from './auth.service';
import { Zone } from './zones.service';

export type OutageType = 'ELECTRICITY' | 'WATER';
export type OutageStatus = 'PLANNED' | 'ONGOING' | 'RESTORED';

export interface Outage {
  id: number;
  type: OutageType;
  zone: Zone;
  startTime: string;
  endTimeEstimated: string | null;
  status: OutageStatus;
  description: string | null;
}

@Injectable({ providedIn: 'root' })
export class OutagesService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  getCurrent(zoneId?: number, type?: OutageType) {
    let params = new HttpParams();
    if (zoneId) {
      params = params.set('zoneId', String(zoneId));
    }
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<Outage[]>(`${API_BASE_URL}/outages`, { params });
  }

  getHistory(zoneId?: number, type?: OutageType) {
    let params = new HttpParams();
    if (zoneId) {
      params = params.set('zoneId', String(zoneId));
    }
    if (type) {
      params = params.set('type', type);
    }
    return this.http.get<Outage[]>(`${API_BASE_URL}/outages/history`, {
      params,
    });
  }

  getOne(id: number) {
    return this.http.get<Outage>(`${API_BASE_URL}/outages/${id}`);
  }

  create(payload: {
    type: OutageType;
    zoneId: number;
    startTime: string;
    endTimeEstimated?: string;
    status?: OutageStatus;
    description?: string;
  }) {
    return this.http.post<Outage>(`${API_BASE_URL}/outages`, payload, {
      headers: this.authHeaders(),
    });
  }

  updateStatus(id: number, status: OutageStatus) {
    return this.http.patch<Outage>(
      `${API_BASE_URL}/outages/${id}/status`,
      { status },
      {
        headers: this.authHeaders(),
      },
    );
  }

  update(
    id: number,
    payload: {
      type: OutageType;
      zoneId: number;
      startTime: string;
      endTimeEstimated?: string;
      status?: OutageStatus;
      description?: string;
    },
  ) {
    return this.http.patch<Outage>(
      `${API_BASE_URL}/outages/${id}`,
      payload,
      {
        headers: this.authHeaders(),
      },
    );
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_BASE_URL}/outages/${id}`, {
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
