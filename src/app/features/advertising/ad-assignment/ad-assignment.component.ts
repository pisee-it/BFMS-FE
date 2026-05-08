import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { BusService } from '@core/services/bus.service';
import { AdContractService } from '@core/services/ad-contract.service';
import { AdAssignmentService } from '@core/services/ad-assignment.service';
import { Bus, BusStatus } from '@core/models/bus.model';
import { AdContract, AdContractStatus } from '@core/models/ad-contract.model';
import { AdAssignmentRequest } from '@core/models/ad-assignment.model';

@Component({
  selector: 'app-ad-assignment',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    ToastModule,
    CardModule
  ],
  templateUrl: './ad-assignment.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdAssignmentComponent implements OnInit {
  private readonly busService = inject(BusService);
  private readonly adContractService = inject(AdContractService);
  private readonly adAssignmentService = inject(AdAssignmentService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly router = inject(Router);

  assignmentForm: FormGroup;
  contracts = signal<AdContract[]>([]);
  buses = signal<Bus[]>([]);
  loading = signal<boolean>(false);
  submitted = false;

  constructor() {
    this.assignmentForm = this.fb.group({
      adContractId: [null, [Validators.required]],
      busId: [null, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadContracts();
    this.loadBuses();
  }

  loadContracts() {
    this.loading.set(true);
    // Lấy song song các hợp đồng đã được duyệt và đã thanh toán
    forkJoin({
      approved: this.adContractService.getContracts(0, 1000, AdContractStatus.APPROVED),
      paid: this.adContractService.getContracts(0, 1000, AdContractStatus.PAID)
    }).subscribe({
      next: (results) => {
        this.contracts.set([...results.approved.content, ...results.paid.content]);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách hợp đồng' });
        this.loading.set(false);
      }
    });
  }

  loadBuses() {
    // Chỉ lấy các xe đang hoạt động (ACTIVE)
    this.busService.getBuses(0, 1000, undefined, { status: BusStatus.ACTIVE }).subscribe({
      next: (response) => {
        this.buses.set(response.content);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách xe buýt' });
      }
    });
  }

  saveAssignment() {
    this.submitted = true;

    if (this.assignmentForm.valid) {
      this.loading.set(true);
      const assignmentData: AdAssignmentRequest = this.assignmentForm.value;

      this.adAssignmentService.createAssignment(assignmentData).subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Thành công', 
            detail: 'Đã gán quảng cáo cho xe buýt thành công' 
          });
          this.loading.set(false);
          // Reset form hoặc quay về danh sách
          setTimeout(() => this.router.navigate(['/advertising/contracts']), 1500);
        },
        error: (error) => {
          this.loading.set(false);
          const detail = error.error?.message || 'Không thể thực hiện gán quảng cáo';
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail });
        }
      });
    } else {
      this.messageService.add({ 
        severity: 'warn', 
        summary: 'Cảnh báo', 
        detail: 'Vui lòng chọn đầy đủ thông tin Hợp đồng và Xe buýt' 
      });
    }
  }

  goBack() {
    this.router.navigate(['/advertising/contracts']);
  }
}
