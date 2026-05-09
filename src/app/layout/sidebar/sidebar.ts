import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, LayoutDashboard, Bus, Route, Users, Settings, LogOut, ChevronLeft, ChevronRight, Calculator, BarChart3 } from 'lucide-angular';
import { LayoutService } from '@core/services/layout.service';

interface MenuItem {
  label: string;
  icon: any;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private readonly layoutService = inject(LayoutService);
  readonly isCollapsed = this.layoutService.isSidebarCollapsed;

  readonly BusIcon = Bus;
  readonly menuItems: MenuItem[] = [
    { label: 'Tổng quan', icon: LayoutDashboard, route: '/dashboard' },
    { label: 'Quản lý Xe buýt', icon: Bus, route: '/buses' },
    { label: 'Tuyến đường', icon: Route, route: '/routes' },
    { label: 'Phân ca trực', icon: Calculator, route: '/shifts' },
    { label: 'Báo cáo tài chính', icon: BarChart3, route: '/reporting' },
    { label: 'Nhân sự', icon: Users, route: '/users' },
  ];

  readonly bottomItems: MenuItem[] = [
    { label: 'Cài đặt', icon: Settings, route: '/settings' },
  ];

  readonly LogoutIcon = LogOut;
  readonly CollapseIcon = ChevronLeft;
  readonly ExpandIcon = ChevronRight;

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }

  onMenuItemClick(): void {
    // Close sidebar on mobile when a menu item is clicked
    if (window.innerWidth <= 1024) {
      this.layoutService.setSidebarCollapsed(true);
    }
  }
}
