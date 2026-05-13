import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdContractService } from '@core/services/ad-contract.service';
import { AuthService } from '@core/services/auth.service';
import { AdContract, AdContractStatus } from '@core/models/ad-contract.model';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contract-management',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TableModule,
    ButtonModule,
    TagModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    SelectModule,
    FormsModule
  ],
  templateUrl: './contract-management.html',
  host: { class: 'block animate-fade-in' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class ContractManagementComponent implements OnInit {
  private readonly adContractService = inject(AdContractService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  userRole = this.authService.currentUserRole;

  contracts = signal<AdContract[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  readonly statusOptions = [
    { label: 'Tất cả trạng thái', value: null },
    { label: 'Chờ duyệt', value: AdContractStatus.PENDING },
    { label: 'Đã phê duyệt', value: AdContractStatus.APPROVED },
    { label: 'Đã thanh toán', value: AdContractStatus.PAID },
    { label: 'Từ chối', value: AdContractStatus.REJECTED },
    { label: 'Yêu cầu xóa', value: AdContractStatus.DELETE_REQUESTED }
  ];

  selectedStatus = signal<AdContractStatus | null>(null);
  readonly ContractStatus = AdContractStatus;

  ngOnInit() {}

  loadContracts(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;
    const status = this.selectedStatus();

    this.adContractService.getContracts(page, size, status || undefined).subscribe({
      next: (response) => {
        this.contracts.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách hợp đồng' });
        this.loading.set(false);
      }
    });
  }

  requestDelete(contract: AdContract) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn yêu cầu xóa hợp đồng này không?`,
      header: 'Xác nhận yêu cầu xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Gửi yêu cầu',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.adContractService.requestDeleteContract(contract.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã gửi yêu cầu xóa hợp đồng' });
            this.refreshTable();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error.error?.message || 'Không thể gửi yêu cầu xóa' });
          }
        });
      }
    });
  }

  approveContract(contract: AdContract) {
    this.confirmationService.confirm({
      message: `Phê duyệt hợp đồng của ${contract.companyName}?`,
      header: 'Phê duyệt hợp đồng',
      icon: 'pi pi-check-circle',
      acceptLabel: 'Phê duyệt',
      rejectLabel: 'Hủy',
      accept: () => {
        this.adContractService.approveContract(contract.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã phê duyệt hợp đồng' });
            this.refreshTable();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error.error?.message || 'Không thể phê duyệt' });
          }
        });
      }
    });
  }

  rejectContract(contract: AdContract) {
    this.confirmationService.confirm({
      message: `Từ chối hợp đồng của ${contract.companyName}?`,
      header: 'Từ chối hợp đồng',
      icon: 'pi pi-times-circle',
      acceptLabel: 'Từ chối',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adContractService.rejectContract(contract.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã từ chối hợp đồng' });
            this.refreshTable();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error.error?.message || 'Không thể từ chối' });
          }
        });
      }
    });
  }

  deleteContract(contract: AdContract) {
    this.confirmationService.confirm({
      message: `Xóa vĩnh viễn hợp đồng của ${contract.companyName}?`,
      header: 'Xác nhận xóa vĩnh viễn',
      icon: 'pi pi-trash',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.adContractService.deleteContract(contract.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa hợp đồng' });
            this.refreshTable();
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: error.error?.message || 'Không thể xóa' });
          }
        });
      }
    });
  }

  viewFile(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  onStatusChange(value: AdContractStatus | null) {
    this.selectedStatus.set(value);
    this.refreshTable();
  }

  refreshTable() {
    this.loadContracts({ first: 0, rows: 10 });
  }

  getStatusSeverity(status: AdContractStatus): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case AdContractStatus.APPROVED: return 'success';
      case AdContractStatus.PENDING: return 'info';
      case AdContractStatus.PAID: return 'success';
      case AdContractStatus.REJECTED: return 'danger';
      case AdContractStatus.DELETE_REQUESTED: return 'warn';
      default: return 'secondary';
    }
  }

  getStatusLabel(status: AdContractStatus): string {
    switch (status) {
      case AdContractStatus.APPROVED: return 'Đã phê duyệt';
      case AdContractStatus.PENDING: return 'Chờ duyệt';
      case AdContractStatus.PAID: return 'Đã thanh toán';
      case AdContractStatus.REJECTED: return 'Từ chối';
      case AdContractStatus.DELETE_REQUESTED: return 'Yêu cầu xóa';
      default: return status;
    }
  }
}
