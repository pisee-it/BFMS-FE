import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '@layout/sidebar/sidebar';
import { NavbarComponent } from '@layout/navbar/navbar';
import { LayoutService } from '@core/services/layout.service';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, NavbarComponent, ToastModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardLayoutComponent {
  private readonly layoutService = inject(LayoutService);
  readonly isSidebarCollapsed = this.layoutService.isSidebarCollapsed;

  toggleSidebar(): void {
    this.layoutService.toggleSidebar();
  }
}
