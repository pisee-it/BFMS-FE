import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * GET request
   */
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${path}`, { params })
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * POST request
   */
  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * PUT request
   */
  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * PATCH request
   */
  patch<T>(path: string, body: any = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * DELETE request
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * Xử lý lỗi tập trung
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía Client
      errorMessage = isDevMode() ? `Lỗi Client: ${error.error.message}` : 'Lỗi kết nối ứng dụng.';
    } else {
      // Lỗi phía Server
      if (error.status === 0) {
        errorMessage = 'Không thể kết nối tới máy chủ.';
      } else if (error.error && typeof error.error === 'object' && error.error.message) {
        // Ưu tiên message từ Backend (AppException)
        errorMessage = error.error.message;
      } else {
        errorMessage = isDevMode() ? `Mã lỗi: ${error.status} - ${error.message}` : 'Lỗi hệ thống từ máy chủ.';
      }
    }
    
    if (isDevMode()) {
      console.error('ApiService Error Details:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error
      });
    }

    // Trả về error object chuẩn để các service phía trên có thể xử lý tiếp nếu cần
    return throwError(() => error);
  }
}
