import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { AdContractService } from '@core/services/ad-contract.service';
import { AdContract, AdContractStatus } from '@core/models/ad-contract.model';

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
    ConfirmDialogModule
  ],
  templateUrl: './contract-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class ContractManagementComponent implements OnInit {
  private readonly adContractService = inject(AdContractService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly router = inject(Router);

  contracts = signal<AdContract[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);

  ngOnInit() {}

  loadContracts(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;

    this.adContractService.getContracts(page, size).subscribe({
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

  viewFile(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
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
