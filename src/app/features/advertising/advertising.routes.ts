import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const ADVERTISING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'contracts',
    pathMatch: 'full'
  },
  {
    path: 'contracts',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('@features/advertising/contract-management/contract-management.component').then(m => m.ContractManagementComponent),
    data: { title: 'Danh sách Hợp đồng', roles: ['ADMIN', 'ACCOUNTANT', 'OWNER'] }
  },
  {
    path: 'companies',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('@features/advertising/company-management/company-management.component').then(m => m.CompanyManagementComponent),
    data: { title: 'Quản lý Đối tác', roles: ['ADMIN', 'ADVERTISING', 'OWNER'] }
  },
  {
    path: 'contracts/new',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('@features/advertising/contract-registration/contract-registration.component').then(m => m.ContractRegistrationComponent),
    data: { title: 'Đăng ký Hợp đồng', roles: ['ADMIN', 'ADVERTISING', 'OWNER'] }
  },
  {
    path: 'assignments',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('@features/advertising/ad-assignment/ad-assignment.component').then(m => m.AdAssignmentComponent),
    data: { title: 'Gán Quảng cáo', roles: ['ADMIN', 'OWNER'] }
  },
  {
    path: 'files',
    canActivate: [authGuard, roleGuard],
    loadComponent: () => import('@features/advertising/file-management/file-management.component').then(m => m.FileManagementComponent),
    data: { title: 'Thư viện Tệp tin', roles: ['ADMIN', 'ADVERTISING', 'OWNER'] }
  }
];
