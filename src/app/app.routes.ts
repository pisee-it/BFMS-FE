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
        data: { roles: ['ADMIN', 'OWNER'] },
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
        path: 'users',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadChildren: () => import('@features/infrastructure/user/user.routes').then(m => m.USER_ROUTES)
      },
      {
        path: 'logs',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () => import('@features/infrastructure/security-log/log-list').then(m => m.LogListComponent)
      },
      {
        path: 'operations',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        children: [
          {
            path: 'nodes',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] },
            loadComponent: () => import('@features/operations/node/node-management').then(m => m.NodeManagementComponent)
          },
          {
            path: 'shifts',
            canActivate: [roleGuard],
            data: { roles: ['ADMIN'] },
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
        path: 'advertising',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'ADVERTISING', 'ACCOUNTANT', 'OWNER'] },
        loadChildren: () => import('@features/advertising/advertising.routes').then(m => m.ADVERTISING_ROUTES)
      },
      {
        path: 'reporting',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OWNER', 'ACCOUNTANT'] },
        loadChildren: () => import('@features/reporting/reporting.routes').then(m => m.REPORTING_ROUTES)
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
