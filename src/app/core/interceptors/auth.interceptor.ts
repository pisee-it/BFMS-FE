import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, BehaviorSubject, filter, take, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

// Trạng thái làm mới token toàn cục
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  // Thêm Token vào Header nếu có (trừ các API public)
  let authReq = req;
  const isAuthRequest = req.url.includes('/api/v1/auth/');

  if (token && !isAuthRequest) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Chỉ xử lý lỗi 401 và không phải từ các request auth
      if (error instanceof HttpErrorResponse && error.status === 401 && !isAuthRequest) {
        return handle401Error(req, next, authService);
      }
      return throwError(() => error);
    })
  );
};

/**
 * Thêm Authorization Header vào request
 */
function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

/**
 * Xử lý lỗi 401: Thử làm mới token
 */
function handle401Error(request: HttpRequest<any>, next: HttpHandlerFn, authService: AuthService) {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap((response) => {
        isRefreshing = false;
        refreshTokenSubject.next(response.accessToken);
        return next(addTokenHeader(request, response.accessToken));
      }),
      catchError((err) => {
        isRefreshing = false;
        authService.logout();
        return throwError(() => err);
      })
    );
  } else {
    // Nếu đang trong quá trình refresh, đợi cho đến khi có token mới
    return refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next(addTokenHeader(request, token!)))
    );
  }
}
