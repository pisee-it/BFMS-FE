import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // State management bằng Signals
  readonly currentUserRole = signal<string | null>(null);
  readonly isAuthenticated = computed(() => !!this.currentUserRole());

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.autoLogin();
    }
  }

  /**
   * Đăng nhập vào hệ thống
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, credentials).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  /**
   * Đăng xuất và dọn dẹp bộ nhớ
   */
  logout(): void {
    this.currentUserRole.set(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }

  /**
   * Tự động đăng nhập nếu có token hợp lệ trong localStorage
   */
  private autoLogin(): void {
    const token = localStorage.getItem('accessToken');
    const role = localStorage.getItem('role');

    if (token && role) {
      this.currentUserRole.set(role.replace('ROLE_', ''));
    }
  }

  /**
   * Lưu thông tin phiên làm việc
   */
  private setSession(authResponse: AuthResponse): void {
    const role = authResponse.role.replace('ROLE_', '');
    this.currentUserRole.set(role);
    localStorage.setItem('accessToken', authResponse.accessToken);
    localStorage.setItem('role', role);
  }

  /**
   * Lấy token hiện tại
   */
  get token(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('accessToken');
    }
    return null;
  }
}
