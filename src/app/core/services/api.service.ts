import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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
      .pipe(catchError(this.handleError));
  }

  /**
   * POST request
   */
  post<T>(path: string, body: any = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * PUT request
   */
  put<T>(path: string, body: any = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * PATCH request
   */
  patch<T>(path: string, body: any = {}): Observable<T> {
    return this.http.patch<T>(`${this.baseUrl}${path}`, body)
      .pipe(catchError(this.handleError));
  }

  /**
   * DELETE request
   */
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${path}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Xử lý lỗi tập trung
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
    
    if (error.error instanceof ErrorEvent) {
      // Lỗi phía Client
      errorMessage = `Lỗi: ${error.error.message}`;
    } else {
      // Lỗi phía Server
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else {
        errorMessage = `Mã lỗi: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    console.error('ApiService Error:', error);
    // Trả về error object chuẩn để các service phía trên có thể xử lý tiếp nếu cần
    return throwError(() => error);
  }
}
