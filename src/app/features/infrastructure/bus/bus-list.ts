import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BusService } from '../../../core/services/bus.service';
import { RouteService } from '../../../core/services/route.service';
import { Bus, BusStatus, BusRequest } from '../../../core/models/bus.model';
import { BusRoute } from '../../../core/models/route.model';

@Component({
  selector: 'app-bus-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DropdownModule,
    InputNumberModule,
    CheckboxModule
  ],
  templateUrl: './bus-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BusListComponent implements OnInit {
  private readonly busService = inject(BusService);
  private readonly routeService = inject(RouteService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Signals for state management
  buses = signal<Bus[]>([]);
  routes = signal<BusRoute[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  
  busDialog = false;
  busForm: FormGroup;
  submitted = false;
  
  statuses = Object.values(BusStatus);

  constructor() {
    this.busForm = this.fb.group({
      id: [null],
      licensePlate: ['', [Validators.required]],
      busModel: [''],
      manufacturer: [''],
      capacity: [0, [Validators.min(0)]],
      yom: [new Date().getFullYear()],
      routeId: [null],
      status: [BusStatus.ACTIVE],
      isAdvertised: [false]
    });
  }

  ngOnInit() {
    this.loadRoutes();
  }

  loadBuses(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;
    const sort = event.sortField ? `${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}` : undefined;
    
    const filters = event.globalFilter ? { globalSearch: event.globalFilter } : undefined;

    this.busService.getBuses(page, size, sort, filters).subscribe({
      next: (response) => {
        this.buses.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách xe buýt' });
        this.loading.set(false);
      }
    });
  }

  loadRoutes() {
    // Tải danh sách tuyến đường để chọn khi thêm/sửa xe
    this.routeService.getRoutes(0, 1000).subscribe({
      next: (response) => {
        this.routes.set(response.content);
      }
    });
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.busForm.reset({
      id: null,
      licensePlate: '',
      busModel: '',
      manufacturer: '',
      capacity: 0,
      yom: new Date().getFullYear(),
      routeId: null,
      status: BusStatus.ACTIVE,
      isAdvertised: false
    });
    this.submitted = false;
    this.busDialog = true;
  }

  editBus(bus: Bus) {
    this.busForm.patchValue(bus);
    this.busDialog = true;
  }

  deleteBus(bus: Bus) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa xe buýt biển số ${bus.licensePlate}?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.busService.deleteBus(bus.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa xe buýt' });
            this.refreshTable();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa xe buýt' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.busDialog = false;
    this.submitted = false;
  }

  saveBus() {
    this.submitted = true;

    if (this.busForm.valid) {
      const busData: BusRequest = { ...this.busForm.value };
      const id = this.busForm.get('id')?.value;

      const observable = id 
        ? this.busService.updateBus(id, busData)
        : this.busService.createBus(busData);

      observable.subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Thành công', 
            detail: id ? 'Đã cập nhật thông tin xe' : 'Đã thêm xe mới' 
          });
          this.busDialog = false;
          this.refreshTable();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lưu thông tin xe buýt' });
        }
      });
    }
  }

  refreshTable() {
    // Cách đơn giản để trigger lại loadBuses là gọi lại với event hiện tại hoặc trigger signal
    // Ở đây ta có thể trigger lại việc load dữ liệu
    this.loadBuses({ first: 0, rows: 10 });
  }

  getStatusClass(status: BusStatus): string {
    const base = 'px-2 py-1 rounded-full text-xs font-bold ';
    switch (status) {
      case BusStatus.ACTIVE:
        return base + 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case BusStatus.INACTIVE:
        return base + 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400';
      case BusStatus.MAINTENANCE:
        return base + 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
      case BusStatus.SOLD:
        return base + 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return base + 'bg-blue-100 text-blue-700';
    }
  }
}
