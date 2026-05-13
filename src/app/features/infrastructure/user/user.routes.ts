import { Routes } from '@angular/router';
import { roleGuard } from '@core/guards/role.guard';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-list').then(m => m.UserListComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN'] }
  }
];
