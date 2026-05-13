import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CostService } from '@core/services/cost.service';
import { RouteService } from '@core/services/route.service';
import { CostResponse, CostRequest, CostType } from '@core/models/cost.model';
import { BusRoute } from '@core/models/route.model';
import { SkeletonTableComponent } from '@shared/components/skeleton-table/skeleton-table';

@Component({
  selector: 'app-cost-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    InputNumberModule,
    DatePickerModule,
    SkeletonTableComponent
  ],
  templateUrl: './cost-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CostListComponent implements OnInit {
  private readonly costService = inject(CostService);
  private readonly routeService = inject(RouteService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Signals
  costs = signal<CostResponse[]>([]);
  routes = signal<BusRoute[]>([]);
  loading = signal<boolean>(false);
  
  costDialog = signal<boolean>(false);
  costForm: FormGroup;
  submitted = false;
  
  costTypes: { label: string, value: CostType }[] = [
    { label: 'Xăng dầu (Fuel)', value: 'FUEL' },
    { label: 'Bảo trì (Maintenance)', value: 'MAINTENANCE' },
    { label: 'Chi phí khác (Other)', value: 'OTHER' }
  ];

  constructor() {
    this.costForm = this.fb.group({
      id: [null],
      routeId: [null, [Validators.required]],
      description: ['', [Validators.required]],
      amount: [0, [Validators.required, Validators.min(1000)]],
      costDate: [new Date(), [Validators.required]],
      costType: ['FUEL', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadRoutes();
    this.loadCosts();
  }

  loadRoutes() {
    this.routeService.getRoutes(0, 100).subscribe({
      next: (res) => this.routes.set(res.content)
    });
  }

  loadCosts() {
    this.loading.set(true);
    this.costService.getCosts().subscribe({
      next: (data) => {
        this.costs.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách chi phí' });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.costForm.reset({
      id: null,
      routeId: null,
      description: '',
      amount: 0,
      costDate: new Date(),
      costType: 'FUEL'
    });
    this.submitted = false;
    this.costDialog.set(true);
  }

  editCost(cost: CostResponse) {
    this.costForm.patchValue({
      ...cost,
      costDate: new Date(cost.costDate)
    });
    this.costDialog.set(true);
  }

  deleteCost(cost: CostResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa bản ghi chi phí này?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.costService.deleteCost(cost.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa chi phí' });
            this.loadCosts();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa chi phí' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.costDialog.set(false);
    this.submitted = false;
  }

  saveCost() {
    this.submitted = true;

    if (this.costForm.valid) {
      const formValue = this.costForm.value;
      const data: CostRequest = {
        ...formValue,
        costDate: this.formatDate(formValue.costDate)
      };
      
      const id = formValue.id;

      const observable = id 
        ? this.costService.updateCost(id, data)
        : this.costService.createCost(data);

      observable.subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Thành công', 
            detail: 'Đã lưu thông tin chi phí' 
          });
          this.costDialog.set(false);
          this.loadCosts();
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: err.error?.message || 'Không thể lưu chi phí' });
        }
      });
    }
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getCostTypeClass(type: CostType): string {
    const base = 'px-2 py-1 rounded-full text-xs font-bold ';
    switch (type) {
      case 'FUEL':
        return base + 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case 'MAINTENANCE':
        return base + 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'OTHER':
        return base + 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      default:
        return base + 'bg-gray-100 text-gray-700';
    }
  }
}
