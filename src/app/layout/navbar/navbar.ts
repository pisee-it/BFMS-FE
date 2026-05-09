import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationService } from '@core/services/notification.service';
import { ThemeService } from '@core/services/theme.service';
import { interval, Subscription, startWith, switchMap } from 'rxjs';
import { LucideAngularModule, Bell, Search, User, ChevronRight, LogOut, Settings, UserCircle, Sun, Moon } from 'lucide-angular';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly notificationService = inject(NotificationService);
  private readonly themeService = inject(ThemeService);
  private notificationSub?: Subscription;

  readonly BellIcon = Bell;
  readonly SearchIcon = Search;
  readonly UserIcon = User;
  readonly ArrowIcon = ChevronRight;
  readonly UserCircleIcon = UserCircle;
  readonly SettingsIcon = Settings;
  readonly LogoutIcon = LogOut;
  readonly SunIcon = Sun;
  readonly MoonIcon = Moon;

  readonly notificationsCount = this.notificationService.unreadCount;
  readonly currentTheme = this.themeService.theme;
  readonly isUserMenuOpen = signal(false);

  readonly breadcrumbs = signal([
    { label: 'Trang chủ', link: '/dashboard' },
    { label: 'Tổng quan', link: null }
  ]);

  ngOnInit() {
    // Polling thông báo mỗi 30 giây
    this.notificationSub = interval(30000).pipe(
      startWith(0),
      switchMap(() => this.notificationService.getNotifications(0, 10))
    ).subscribe();
  }

  ngOnDestroy() {
    this.notificationSub?.unsubscribe();
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update(v => !v);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }
}
