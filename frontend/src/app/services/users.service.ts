import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API_BASE_URL } from '../config';
import { AuthService } from './auth.service';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  findAll() {
    return this.http.get<AdminUser[]>(`${API_BASE_URL}/users`, {
      headers: this.authHeaders(),
    });
  }

  create(payload: { name: string; email: string; password: string; role: string }) {
    return this.http.post<AdminUser>(`${API_BASE_URL}/users`, payload, {
      headers: this.authHeaders(),
    });
  }

  delete(id: number) {
    return this.http.delete<void>(`${API_BASE_URL}/users/${id}`, {
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
