import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

import { API_ENDPOINTS } from '../constants/api-endpoints';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  // Clone request để thêm Header Authorization nếu có token (ngoại trừ API login)
  let authReq = req;
  const isLoginRequest = req.url.includes(API_ENDPOINTS.AUTH.LOGIN);

  if (token && !isLoginRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Xử lý lỗi 401 (Unauthorized)
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
