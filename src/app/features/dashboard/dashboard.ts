import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { LucideAngularModule, TrendingUp, Users, Banknote, Wallet, BarChart3, PieChart, Calendar, RefreshCw } from 'lucide-angular';
import { ReportService } from '@core/services/report.service';
import { RevenueResponse } from '@core/models/revenue-report.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartModule,
    LucideAngularModule,
    CurrencyPipe,
    DecimalPipe
  ],
  template: `
    <div class="animate-fade-in p-4 lg:p-8 relative min-h-screen overflow-hidden">
      <!-- Background Decorative Elements -->
      <div class="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] -z-10"></div>
      <div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] -z-10"></div>
      
      <!-- Header Area -->
      <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="w-8 h-[2px] bg-blue-500"></span>
            <span class="text-blue-500 font-semibold text-sm uppercase tracking-[0.2em]">Financial Insights</span>
          </div>
          <h2 class="text-4xl font-extrabold text-white tracking-tight">Tổng quan Hệ thống</h2>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="glassmorphism px-4 py-2 rounded-xl border border-white/5 flex items-center gap-3">
            <lucide-angular [img]="CalendarIcon" size="18" class="text-gray-400"></lucide-angular>
            <span class="text-sm font-medium text-gray-300">{{ today | date:'dd MMMM, yyyy' }}</span>
          </div>
          <button (click)="fetchDashboardData()" 
                  class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95 group">
            <lucide-angular [img]="RefreshIcon" size="20" [class.animate-spin]="loading()"></lucide-angular>
          </button>
        </div>
      </header>
      
      <!-- Quick Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        @for (stat of quickStats(); track stat.label) {
          <div class="stats-card p-6 glassmorphism rounded-3xl border border-white/10 group relative overflow-hidden flex flex-col justify-between">
            <div class="flex justify-between items-start mb-6">
              <div class="p-3.5 rounded-2xl shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3" [style.background]="stat.iconBg">
                <lucide-angular [img]="stat.icon" [size]="24" [style.color]="stat.iconColor"></lucide-angular>
              </div>
              <div class="flex flex-col items-end">
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Status</span>
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span class="text-xs font-semibold text-green-500/80">Live</span>
                </div>
              </div>
            </div>
            
            <div>
              <span class="text-sm font-medium text-gray-400 tracking-wide">{{ stat.label }}</span>
              <div class="text-3xl font-black text-white mt-1.5 flex items-baseline gap-1">
                {{ stat.value }}
              </div>
            </div>
            
            <!-- Background Accent -->
            <div class="absolute -right-6 -bottom-6 w-32 h-32 blur-[60px] opacity-20 transition-opacity group-hover:opacity-40" 
                 [style.background]="stat.iconColor"></div>
          </div>
        }
      </div>

      <!-- Analysis Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <!-- Main Trend Chart -->
        <div class="lg:col-span-2 glassmorphism p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h3 class="text-xl font-bold text-white flex items-center gap-3">
                <lucide-angular [img]="BarChartIcon" size="22" class="text-blue-400"></lucide-angular>
                Phân tích Hiệu suất Tài chính
              </h3>
              <p class="text-sm text-gray-400 mt-1">Dữ liệu so sánh giữa doanh thu và lợi nhuận thuần</p>
            </div>
            <div class="flex gap-4">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Doanh thu</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                <span class="text-xs font-medium text-gray-400 uppercase tracking-wider">Lợi nhuận</span>
              </div>
            </div>
          </div>
          
          <div class="h-[350px] relative z-10">
            @if (loading()) {
              <div class="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-sm rounded-xl z-20">
                <div class="flex flex-col items-center gap-3">
                  <div class="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                  <span class="text-[10px] text-blue-400 font-bold tracking-[0.3em] uppercase">Syncing Analytics</span>
                </div>
              </div>
            }
            <p-chart type="line" [data]="revenueChartData()" [options]="chartOptions"></p-chart>
          </div>
        </div>

        <!-- Revenue Composition -->
        <div class="glassmorphism p-8 rounded-[2rem] border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
          <div class="mb-10 relative z-10">
            <h3 class="text-xl font-bold text-white flex items-center gap-3">
              <lucide-angular [img]="PieChartIcon" size="22" class="text-purple-400"></lucide-angular>
              Cấu trúc Nguồn thu
            </h3>
            <p class="text-sm text-gray-400 mt-1">Phân bổ doanh thu theo danh mục</p>
          </div>
          
          <div class="flex-1 flex items-center justify-center relative z-10">
            @if (loading()) {
              <div class="w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center">
                <div class="w-32 h-32 rounded-full border-8 border-blue-500/10 border-t-blue-500 animate-spin"></div>
              </div>
            } @else {
              <p-chart type="doughnut" [data]="distributionChartData()" [options]="doughnutOptions" class="w-full max-w-[260px]"></p-chart>
              <!-- Center Text Overlay -->
              <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span class="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">Total Revenue</span>
                <span class="text-2xl font-black text-white">{{ (revenueData()?.totalTicketRevenue || 0) + (revenueData()?.totalAdRevenue || 0) | number:'1.0-0' }}</span>
                <span class="text-[10px] text-gray-500 font-medium">VNĐ</span>
              </div>
            }
          </div>
          
          <div class="mt-10 space-y-3 relative z-10">
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-default group">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                <span class="text-sm font-medium text-gray-300">Vé xe</span>
              </div>
              <span class="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{{ (revenueData()?.totalTicketRevenue || 0) | currency:'VND':'symbol':'1.0-0' }}</span>
            </div>
            <div class="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-default group">
              <div class="flex items-center gap-3">
                <div class="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                <span class="text-sm font-medium text-gray-300">Quảng cáo</span>
              </div>
              <span class="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">{{ (revenueData()?.totalAdRevenue || 0) | currency:'VND':'symbol':'1.0-0' }}</span>
            </div>
          </div>

          <!-- Decorative spot -->
          <div class="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-600/10 blur-[80px] -z-10"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(24px);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      &:hover {
        background: rgba(255, 255, 255, 0.07);
        transform: translateY(-10px) scale(1.01);
        border-color: rgba(255, 255, 255, 0.25);
        box-shadow: 0 40px 80px -15px rgba(0, 0, 0, 0.5);
      }
    }
    
    :host ::ng-deep .p-chart {
      height: 100%;
    }

    @keyframes pulse-soft {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.4; }
    }
    
    .animate-pulse-soft {
      animation: pulse-soft 3s infinite ease-in-out;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly reportService = inject(ReportService);

  loading = signal<boolean>(false);
  revenueData = signal<RevenueResponse | null>(null);
  today = new Date();

  // Icons
  readonly TrendingUpIcon = TrendingUp;
  readonly UsersIcon = Users;
  readonly BanknoteIcon = Banknote;
  readonly WalletIcon = Wallet;
  readonly BarChartIcon = BarChart3;
  readonly PieChartIcon = PieChart;
  readonly CalendarIcon = Calendar;
  readonly RefreshIcon = RefreshCw;

  quickStats = computed(() => {
    const data = this.revenueData();
    return [
      {
        label: 'Doanh thu vé',
        value: (data?.totalTicketRevenue || 0).toLocaleString() + ' đ',
        icon: this.BanknoteIcon,
        iconColor: '#3b82f6',
        iconBg: 'rgba(59, 130, 246, 0.15)'
      },
      {
        label: 'Doanh thu QC',
        value: (data?.totalAdRevenue || 0).toLocaleString() + ' đ',
        icon: this.WalletIcon,
        iconColor: '#f59e0b',
        iconBg: 'rgba(245, 158, 11, 0.15)'
      },
      {
        label: 'Lợi nhuận ròng',
        value: (data?.netProfit || 0).toLocaleString() + ' đ',
        icon: this.TrendingUpIcon,
        iconColor: '#10b981',
        iconBg: 'rgba(16, 185, 129, 0.15)'
      },
      {
        label: 'Tổng hành khách',
        value: (data?.totalPassengers || 0).toLocaleString(),
        icon: this.UsersIcon,
        iconColor: '#8b5cf6',
        iconBg: 'rgba(139, 92, 246, 0.15)'
      }
    ];
  });

  revenueChartData = computed(() => {
    const data = this.revenueData();
    return {
      labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      datasets: [
        {
          label: 'Doanh thu',
          data: [65, 59, 80, 81, 56, 55, 40].map(v => v * (data?.totalTicketRevenue || 12400000) / 100),
          fill: true,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.05)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#3b82f6',
          borderWidth: 3
        },
        {
          label: 'Lợi nhuận',
          data: [28, 48, 40, 19, 86, 27, 90].map(v => v * (data?.netProfit || 8200000) / 100),
          fill: true,
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.05)',
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#10b981',
          borderWidth: 3
        }
      ]
    };
  });

  distributionChartData = computed(() => {
    const data = this.revenueData();
    return {
      labels: ['Vé xe', 'Quảng cáo'],
      datasets: [
        {
          data: [data?.totalTicketRevenue || 70, data?.totalAdRevenue || 30],
          backgroundColor: ['#3b82f6', '#f59e0b'],
          hoverBackgroundColor: ['#2563eb', '#d97706'],
          borderWidth: 0,
          borderRadius: 10,
          spacing: 8
        }
      ]
    };
  });

  chartOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' },
        bodyFont: { size: 13 },
        cornerRadius: 12,
        displayColors: true
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#6b7280', font: { size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.03)', drawBorder: false },
        ticks: { 
          color: '#6b7280', 
          font: { size: 11 },
          callback: (value: any) => (value / 1000000).toFixed(1) + 'M'
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false
  };

  doughnutOptions = {
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 12
      }
    },
    cutout: '82%',
    responsive: true,
    maintainAspectRatio: false
  };

  ngOnInit() {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.loading.set(true);
    this.reportService.getTotalRevenue('day').pipe(
      finalize(() => this.loading.set(false))
    ).subscribe({
      next: (res) => this.revenueData.set(res),
      error: (err) => console.error('Error fetching dashboard data', err)
    });
  }
}
