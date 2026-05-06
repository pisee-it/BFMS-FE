import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  username: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/auth';

  readonly currentUser = signal<LoginResponse | null>(null);

  login(credentials: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        this.currentUser.set(response);
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
      })
    );
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  get token(): string | null {
    return localStorage.getItem('accessToken');
  }
}
