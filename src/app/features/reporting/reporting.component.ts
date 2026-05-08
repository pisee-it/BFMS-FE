import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SkeletonModule } from 'primeng/skeleton';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReportService } from '@core/services/report.service';
import { RouteService } from '@core/services/route.service';
import { RevenueResponse, RouteReportResponse } from '@core/models/revenue-report.model';
import { BusRoute } from '@core/models/route.model';
import { SkeletonTableComponent } from '@shared/components/skeleton-table/skeleton-table';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-reporting',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DatePickerModule,
    SelectModule,
    CardModule,
    ChartModule,
    ToastModule,
    SkeletonModule,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    SkeletonTableComponent
  ],
  templateUrl: './reporting.html',
  styleUrl: './reporting.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportingComponent implements OnInit {
  private readonly reportService = inject(ReportService);
  private readonly routeService = inject(RouteService);
  private readonly messageService = inject(MessageService);

  // Filters
  dateRange = signal<Date[]>([
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date()
  ]);
  selectedRoute = signal<BusRoute | null>(null);
  routes = signal<BusRoute[]>([]);

  // Data
  summary = signal<RevenueResponse | null>(null);
  details = signal<RouteReportResponse[]>([]);
  loading = signal<boolean>(false);

  // Chart Data
  chartData = computed(() => {
    const data = this.summary();
    if (!data) return null;

    return {
      labels: ['Vé xe', 'Quảng cáo'],
      datasets: [
        {
          data: [data.totalTicketRevenue, data.totalAdRevenue],
          backgroundColor: ['#ffffff', 'rgba(255, 255, 255, 0.2)'],
          hoverBackgroundColor: ['#f0f0f0', 'rgba(255, 255, 255, 0.3)'],
          borderWidth: 0
        }
      ]
    };
  });

  chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '80%'
  };

  ngOnInit() {
    this.loadRoutes();
    this.fetchData();
  }

  loadRoutes() {
    this.routeService.getRoutes(0, 100).subscribe({
      next: (response) => {
        this.routes.set(response.content);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách tuyến' });
      }
    });
  }

  fetchData() {
    this.loading.set(true);
    const startDate = this.dateRange()[0]?.toISOString().split('T')[0];
    const endDate = this.dateRange()[1]?.toISOString().split('T')[0];

    // Fetch summary for the period (simplified as daily/monthly based on dateRange)
    this.reportService.getTotalRevenue('month', startDate).pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (res) => this.summary.set(res),
      error: () => this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải tổng hợp doanh thu' })
    });

    // Fetch detailed report for selected route or all if none selected
    // Note: The BE API export endpoint currently returns a single RouteReportResponse for one routeId.
    // In a real scenario, we might want to fetch reports for all routes to fill a table.
    if (this.selectedRoute()) {
      this.reportService.getRouteReport(this.selectedRoute()!.id, startDate, endDate).subscribe({
        next: (res) => this.details.set([res]),
        error: () => this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải chi tiết tuyến' })
      });
    } else {
      // If no route selected, maybe fetch first 5 routes just for demonstration
      // Ideally, the BE should have a GET /api/v1/reports/all
      this.details.set([]);
    }
  }

  onFilterChange() {
    this.fetchData();
  }

  exportExcel() {
    if (!this.selectedRoute()) {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn tuyến xe để xuất báo cáo' });
      return;
    }

    const startDate = this.dateRange()[0]?.toISOString().split('T')[0];
    const endDate = this.dateRange()[1]?.toISOString().split('T')[0];

    this.reportService.downloadExcelReport(this.selectedRoute()!.id, startDate, endDate).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Bao-cao-doanh-thu-${this.selectedRoute()?.routeNumber}-${new Date().toLocaleDateString()}.xlsx`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã tải báo cáo Excel' });
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xuất báo cáo Excel' });
      }
    });
  }
}
