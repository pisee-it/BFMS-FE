import { Routes } from '@angular/router';

export const ADVERTISING_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'contracts',
    pathMatch: 'full'
  },
  {
    path: 'contracts',
    loadComponent: () => import('@features/advertising/contract-management/contract-management.component').then(m => m.ContractManagementComponent),
    data: { title: 'Danh sách Hợp đồng' }
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
  },
  {
    path: 'assignments',
    loadComponent: () => import('@features/advertising/ad-assignment/ad-assignment.component').then(m => m.AdAssignmentComponent),
    data: { title: 'Gán Quảng cáo' }
  },
  {
    path: 'files',
    loadComponent: () => import('@features/advertising/file-management/file-management.component').then(m => m.FileManagementComponent),
    data: { title: 'Thư viện Tệp tin' }
  }
];
