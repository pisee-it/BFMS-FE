import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type UserRole = 'ADMIN' | 'OWNER' | 'STAFF' | 'ACCOUNTANT' | 'ADVERTISING';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private readonly platformId = inject(PLATFORM_ID);

  // --- Auth State ---
  readonly userRole = signal<string | null>(null);
  readonly isAuthenticated = computed(() => !!this.userRole());

  // --- UI State ---
  readonly theme = signal<'light' | 'dark'>('dark');
  readonly isLoading = signal<boolean>(false);

  // --- Permissions ---
  readonly isAdmin = computed(() => this.userRole() === 'ADMIN');
  readonly isOwner = computed(() => this.userRole() === 'OWNER');
  readonly isStaff = computed(() => this.userRole() === 'STAFF');
  readonly isAccountant = computed(() => this.userRole() === 'ACCOUNTANT');
  readonly isAdvertising = computed(() => this.userRole() === 'ADVERTISING');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.hydrateState();
    }
  }

  /**
   * Khởi tạo lại state từ localStorage (SSR-safe)
   */
  private hydrateState(): void {
    const role = localStorage.getItem('role');
    if (role) {
      this.userRole.set(role);
    }

    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      this.theme.set(savedTheme);
    }
  }

  /**
   * Cập nhật Role và lưu vào localStorage
   */
  setRole(role: string | null): void {
    this.userRole.set(role);
    if (isPlatformBrowser(this.platformId)) {
      if (role) {
        localStorage.setItem('role', role);
      } else {
        localStorage.removeItem('role');
      }
    }
  }

  /**
   * Cập nhật Theme và lưu vào localStorage
   */
  setTheme(theme: 'light' | 'dark'): void {
    this.theme.set(theme);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', theme);
    }
  }

  /**
   * Cập nhật trạng thái loading toàn cục
   */
  setLoading(loading: boolean): void {
    this.isLoading.set(loading);
  }

  /**
   * Xóa toàn bộ state (khi logout)
   */
  clearState(): void {
    this.userRole.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('role');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * Lưu trữ tokens
   */
  setTokens(access: string, refresh: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
    }
  }

  /**
   * Lấy Refresh Token
   */
  get refreshToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('refreshToken');
    }
    return null;
  }
}
