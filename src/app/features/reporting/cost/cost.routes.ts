import { Routes } from '@angular/router';
import { roleGuard } from '@core/guards/role.guard';

export const COST_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./cost-list').then(m => m.CostListComponent),
    canActivate: [roleGuard],
    data: { roles: ['ADMIN', 'ACCOUNTANT'] }
  }
];
