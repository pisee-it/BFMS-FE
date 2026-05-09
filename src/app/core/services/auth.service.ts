import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthResponse, LoginRequest } from '../models/auth.model';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiService = inject(ApiService);
  private readonly store = inject(StoreService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  // State management bằng Signals
  // Các tín hiệu trạng thái giờ được quản lý tập trung trong StoreService
  readonly currentUserRole = this.store.userRole;
  readonly isAuthenticated = this.store.isAuthenticated;

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
    this.store.clearState();
    this.router.navigate(['/login']);
  }

  /**
   * Tự động đăng nhập nếu có token hợp lệ trong localStorage
   */
  private autoLogin(): void {
    // Logic autoLogin hiện tại đã được handle một phần trong StoreService constructor (hydrateState)
    // Nếu cần logic phức tạp hơn (ví dụ check token expiry) thì thêm vào đây.
  }

  /**
   * Làm mới Access Token bằng Refresh Token
   */
  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.store.refreshToken;
    return this.apiService.post<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, { refreshToken }).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  /**
   * Lưu thông tin phiên làm việc
   */
  private setSession(authResponse: AuthResponse): void {
    const role = authResponse.role.replace('ROLE_', '');
    this.store.setRole(role);
    this.store.setTokens(authResponse.accessToken, authResponse.refreshToken);
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
