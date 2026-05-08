import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { MessageService, ConfirmationService } from 'primeng/api';
import { RouteService } from '@core/services/route.service';
import { BusRoute, RouteRequest } from '@core/models/route.model';

@Component({
  selector: 'app-route-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    DialogModule,
    InputNumberModule,
    DecimalPipe
  ],
  templateUrl: './route-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RouteListComponent implements OnInit {
  private readonly routeService = inject(RouteService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Signals for state management
  routes = signal<BusRoute[]>([]);
  totalRecords = signal<number>(0);
  loading = signal<boolean>(false);
  
  routeDialog = false;
  routeForm: FormGroup;
  submitted = false;

  constructor() {
    this.routeForm = this.fb.group({
      id: [null],
      routeNumber: ['', [Validators.required]],
      stopA: ['', [Validators.required]],
      stopB: ['', [Validators.required]],
      path: [''],
      distanceAB: [0, [Validators.min(0)]],
      distanceBA: [0, [Validators.min(0)]],
      operationStart: ['05:00'],
      operationEnd: ['22:00'],
      price: [0, [Validators.min(0)]]
    });
  }

  ngOnInit() {
    // Initial data load is handled by p-table lazy load event
  }

  loadRoutes(event: any) {
    this.loading.set(true);
    const page = event.first / event.rows;
    const size = event.rows;
    const sort = event.sortField ? `${event.sortField},${event.sortOrder === 1 ? 'asc' : 'desc'}` : undefined;
    
    const filters = event.globalFilter ? { globalSearch: event.globalFilter } : undefined;

    this.routeService.getRoutes(page, size, sort, filters).subscribe({
      next: (response) => {
        this.routes.set(response.content);
        this.totalRecords.set(response.totalElements);
        this.loading.set(false);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách tuyến đường' });
        this.loading.set(false);
      }
    });
  }

  onGlobalFilter(table: any, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew() {
    this.routeForm.reset({
      id: null,
      routeNumber: '',
      stopA: '',
      stopB: '',
      path: '',
      distanceAB: 0,
      distanceBA: 0,
      operationStart: '05:00',
      operationEnd: '22:00',
      price: 0
    });
    this.submitted = false;
    this.routeDialog = true;
  }

  editRoute(route: BusRoute) {
    this.routeForm.patchValue(route);
    this.routeDialog = true;
  }

  deleteRoute(route: BusRoute) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa tuyến đường ${route.routeNumber} (${route.stopA} - ${route.stopB})?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.routeService.deleteRoute(route.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa tuyến đường' });
            this.refreshTable();
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa tuyến đường' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.routeDialog = false;
    this.submitted = false;
  }

  saveRoute() {
    this.submitted = true;

    if (this.routeForm.valid) {
      const routeData: RouteRequest = { ...this.routeForm.value };
      const id = this.routeForm.get('id')?.value;

      const observable = id 
        ? this.routeService.updateRoute(id, routeData)
        : this.routeService.createRoute(routeData);

      observable.subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Thành công', 
            detail: id ? 'Đã cập nhật thông tin tuyến' : 'Đã thêm tuyến mới' 
          });
          this.routeDialog = false;
          this.refreshTable();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể lưu thông tin tuyến đường' });
        }
      });
    }
  }

  refreshTable() {
    this.loadRoutes({ first: 0, rows: 10 });
  }
}
