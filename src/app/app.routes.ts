import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('@features/auth/login/login').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('@layout/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: 'dashboard',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'USER'] },
        loadComponent: () => import('@features/dashboard/dashboard').then(m => m.DashboardComponent)
      },
      {
        path: 'buses',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('@features/infrastructure/bus/bus-list').then(m => m.BusListComponent)
      },
      {
        path: 'routes',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('@features/infrastructure/route/route-list').then(m => m.RouteListComponent)
      },
      {
        path: 'operations',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
          {
            path: 'nodes',
            loadComponent: () => import('@features/operations/node/node-management').then(m => m.NodeManagementComponent)
          },
          {
            path: 'shifts',
            loadComponent: () => import('@features/operations/shift/shift-scheduling').then(m => m.ShiftSchedulingComponent)
          },
          {
            path: 'shift-selection',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN', 'STAFF'] },
            loadComponent: () => import('@features/operations/shift/shift-selection/shift-selection').then(m => m.ShiftSelectionComponent)
          },
          {
            path: 'shift-completion/:routeId/:shiftId',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN', 'STAFF'] },
            loadComponent: () => import('@features/operations/shift/shift-completion/shift-completion').then(m => m.ShiftCompletionComponent)
          }
        ]
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
