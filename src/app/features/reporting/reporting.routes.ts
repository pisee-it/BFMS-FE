import { Routes } from '@angular/router';
import { roleGuard } from '@core/guards/role.guard';

export const REPORTING_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./reporting.component').then(m => m.ReportingComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'OWNER'] }
  },
  {
    path: 'costs',
    loadChildren: () => import('./cost/cost.routes').then(m => m.COST_ROUTES)
  }
];
