import { Routes } from '@angular/router';

export const ADVERTISING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full'
  },
  {
    path: 'companies',
    loadComponent: () => import('@features/advertising/company-management/company-management.component').then(m => m.CompanyManagementComponent),
    data: { title: 'Quản lý Đối tác' }
  },
  {
    path: 'contracts/new',
    loadComponent: () => import('@features/advertising/contract-registration/contract-registration.component').then(m => m.ContractRegistrationComponent),
    data: { title: 'Đăng ký Hợp đồng' }
  }
];
