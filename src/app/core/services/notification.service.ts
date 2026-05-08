import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { NotificationResponse } from '@core/models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/notifications';

  unreadCount = signal<number>(0);

  getNotifications(page: number = 0, size: number = 10): Observable<NotificationResponse> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<NotificationResponse>(this.apiUrl, { params }).pipe(
      tap(response => {
        // Cập nhật số lượng chưa đọc nếu là trang đầu tiên
        if (page === 0) {
          const unread = response.content.filter(n => !n.isRead).length;
          // Lưu ý: Đây chỉ là đếm trong trang hiện tại. 
          // Nếu backend hỗ trợ lấy unread count riêng thì tốt hơn.
          // Tạm thời set theo logic đơn giản.
          this.unreadCount.set(unread);
        }
      })
    );
  }

  markAsRead(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/read`, {}).pipe(
      tap(() => {
        this.unreadCount.update(count => Math.max(0, count - 1));
      })
    );
  }
}
