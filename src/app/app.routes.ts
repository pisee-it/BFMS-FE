import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'USER'] },
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
