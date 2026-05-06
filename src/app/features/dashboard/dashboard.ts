import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  template: `
    <div class="animate-fade-in">
      <h2 class="text-3xl font-bold text-white mb-2">Chào mừng trở lại, Admin!</h2>
      <p class="text-gray-400 mb-8">Dưới đây là tóm tắt tình hình hệ thống BFMS hôm nay.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="stats-card p-6 glassmorphism rounded-2xl border border-white/5">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng số xe</span>
          <div class="text-3xl font-bold text-white mt-1">42</div>
        </div>
        <div class="stats-card p-6 glassmorphism rounded-2xl border border-white/5">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tuyến đang chạy</span>
          <div class="text-3xl font-bold text-white mt-1">18</div>
        </div>
        <div class="stats-card p-6 glassmorphism rounded-2xl border border-white/5">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nhân sự trực</span>
          <div class="text-3xl font-bold text-white mt-1">124</div>
        </div>
        <div class="stats-card p-6 glassmorphism rounded-2xl border border-white/5">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Doanh thu ngày</span>
          <div class="text-3xl font-bold text-green-400 mt-1">12.4M</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-card {
      background: rgba(255, 255, 255, 0.02);
      transition: all 0.3s ease;
      &:hover {
        background: rgba(255, 255, 255, 0.05);
        transform: translateY(-4px);
        border-color: rgba(255, 255, 255, 0.1);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {}
