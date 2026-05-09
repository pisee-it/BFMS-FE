import { inject, Injectable, signal } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable, tap, interval, Subscription, startWith, switchMap } from 'rxjs';
import { NotificationResponse } from '@core/models/notification.model';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly apiService = inject(ApiService);
  private readonly messageService = inject(MessageService);
  
  readonly unreadCount = signal<number>(0);
  private pollingSubscription?: Subscription;

  /**
   * Hiển thị Toast thông báo thành công
   */
  showSuccess(detail: string, summary: string = 'Thành công'): void {
    this.messageService.add({ severity: 'success', summary, detail, life: 3000 });
  }

  /**
   * Hiển thị Toast thông báo lỗi
   */
  showError(detail: string, summary: string = 'Lỗi'): void {
    this.messageService.add({ severity: 'error', summary, detail, life: 5000 });
  }

  /**
   * Hiển thị Toast thông báo cảnh báo
   */
  showWarn(detail: string, summary: string = 'Cảnh báo'): void {
    this.messageService.add({ severity: 'warn', summary, detail, life: 4000 });
  }

  /**
   * Hiển thị Toast thông báo thông tin
   */
  showInfo(detail: string, summary: string = 'Thông tin'): void {
    this.messageService.add({ severity: 'info', summary, detail, life: 3000 });
  }

  /**
   * Lấy danh sách thông báo (Phân trang)
   */
  getNotifications(page: number = 0, size: number = 10): Observable<NotificationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.apiService.get<NotificationResponse>(API_ENDPOINTS.NOTIFICATIONS.BASE, params).pipe(
      tap(response => {
        if (page === 0) {
          const unread = response.content.filter(n => !n.isRead).length;
          this.unreadCount.set(unread);
        }
      })
    );
  }

  /**
   * Đánh dấu đã đọc
   */
  markAsRead(id: number): Observable<void> {
    return this.apiService.patch<void>(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id), {}).pipe(
      tap(() => {
        this.unreadCount.update(count => Math.max(0, count - 1));
      })
    );
  }

  /**
   * Bắt đầu Polling lấy thông báo mới
   */
  startPolling(intervalMs: number = 30000): void {
    this.stopPolling();
    this.pollingSubscription = interval(intervalMs).pipe(
      startWith(0),
      switchMap(() => this.getNotifications(0, 10))
    ).subscribe();
  }

  /**
   * Dừng Polling
   */
  stopPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }
}
