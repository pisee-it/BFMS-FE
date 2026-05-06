import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { LucideAngularModule, Bell, Search, User, ChevronRight, LogOut, Settings, UserCircle } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class NavbarComponent {
  readonly BellIcon = Bell;
  readonly SearchIcon = Search;
  readonly UserIcon = User;
  readonly ArrowIcon = ChevronRight;
  readonly UserCircleIcon = UserCircle;
  readonly SettingsIcon = Settings;
  readonly LogoutIcon = LogOut;

  readonly notificationsCount = 3;
  readonly isUserMenuOpen = signal(false);

  readonly breadcrumbs = signal([
    { label: 'Trang chủ', link: '/dashboard' },
    { label: 'Tổng quan', link: null }
  ]);

  toggleUserMenu(): void {
    console.log('Toggle User Menu clicked, current state:', this.isUserMenuOpen());
    this.isUserMenuOpen.update(v => !v);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }
}
