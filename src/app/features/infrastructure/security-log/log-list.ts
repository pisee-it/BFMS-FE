import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SecurityService } from '@core/services/security.service';
import { SecurityLogResponse } from '@core/models/security-log.model';
import { SkeletonTableComponent } from '@shared/components/skeleton-table/skeleton-table';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    SkeletonTableComponent
  ],
  templateUrl: './log-list.html',
  host: { class: 'block animate-fade-in' },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogListComponent implements OnInit {
  private readonly securityService = inject(SecurityService);

  // Signals
  logs = signal<SecurityLogResponse[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  
  usernameFilter = signal<string>('');
  actionFilter = signal<string>('');

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs(event?: any) {
    this.loading.set(true);
    const page = event ? event.first / event.rows : 0;
    const size = event ? event.rows : 20;

    this.securityService.getLogs(this.usernameFilter(), this.actionFilter(), page, size).subscribe({
      next: (res) => {
        // Backend pagination response typically has 'content' and 'totalElements'
        this.logs.set(res.content || []);
        this.totalRecords.set(res.totalElements || 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onUsernameFilter(value: string) {
    this.usernameFilter.set(value);
    this.loadLogs();
  }

  onActionFilter(value: string) {
    this.actionFilter.set(value);
    this.loadLogs();
  }
}
