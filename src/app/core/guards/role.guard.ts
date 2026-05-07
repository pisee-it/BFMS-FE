import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const expectedRoles = (route.data?.['roles'] as string[]) || [];
  const userRole = authService.currentUserRole();

  if (userRole && expectedRoles.includes(userRole)) {
    return true;
  }

  // Nếu không đủ quyền, đẩy về dashboard hoặc trang thông báo lỗi
  // Ở đây mặc định đẩy về dashboard
  return router.createUrlTree(['/dashboard']);
};
