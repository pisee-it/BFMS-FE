import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { MessageService, ConfirmationService } from 'primeng/api';
import { NodeService } from '@core/services/node.service';
import { RouteService } from '@core/services/route.service';
import { NodeResponse, NodeRequest } from '@core/models/node.model';
import { BusRoute } from '@core/models/route.model';

@Component({
  selector: 'app-node-management',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    SelectModule,
    DatePickerModule
  ],
  templateUrl: './node-management.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeManagementComponent implements OnInit {
  private readonly nodeService = inject(NodeService);
  private readonly routeService = inject(RouteService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

  // Signals
  routes = signal<BusRoute[]>([]);
  selectedRoute = signal<BusRoute | null>(null);
  nodes = signal<NodeResponse[]>([]);
  loading = signal<boolean>(false);

  nodeDialog = signal<boolean>(false);
  nodeForm: FormGroup;
  submitted = false;

  constructor() {
    this.nodeForm = this.fb.group({
      id: [null],
      nodeNumber: [null, [Validators.required, Validators.min(1)]],
      executionDate: [new Date(), [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes(0, 100).subscribe({
      next: (response) => {
        this.routes.set(response.content);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách tuyến' });
      }
    });
  }

  onRouteSelect(route: BusRoute) {
    this.selectedRoute.set(route);
    this.loadNodes(route.id);
  }

  loadNodes(routeId: number) {
    this.loading.set(true);
    this.nodeService.getNodesByRoute(routeId).subscribe({
      next: (data) => {
        this.nodes.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách nốt xe' });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    if (!this.selectedRoute()) {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn tuyến xe trước' });
      return;
    }
    this.nodeForm.reset({
      id: null,
      nodeNumber: this.nodes().length + 1,
      executionDate: new Date(),
      description: ''
    });
    this.submitted = false;
    this.nodeDialog.set(true);
  }

  editNode(node: NodeResponse) {
    this.nodeForm.patchValue({
      ...node,
      executionDate: new Date(node.executionDate)
    });
    this.nodeDialog.set(true);
  }

  deleteNode(node: NodeResponse) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa nốt xe số ${node.nodeNumber}?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.nodeService.deleteNode(node.id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã xóa nốt xe' });
            this.loadNodes(this.selectedRoute()!.id);
          },
          error: () => {
            this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể xóa nốt xe' });
          }
        });
      }
    });
  }

  hideDialog() {
    this.nodeDialog.set(false);
    this.submitted = false;
  }

  saveNode() {
    this.submitted = true;
    const route = this.selectedRoute();

    if (this.nodeForm.valid && route) {
      const formValue = this.nodeForm.value;
      const nodeData: NodeRequest = {
        ...formValue,
        executionDate: this.formatDate(formValue.executionDate)
      };

      const id = formValue.id;

      const observable = id 
        ? this.nodeService.updateNode(id, nodeData)
        : this.nodeService.createNode(route.id, nodeData);

      observable.subscribe({
        next: () => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Thành công', 
            detail: id ? 'Đã cập nhật nốt xe' : 'Đã tạo nốt xe mới' 
          });
          this.nodeDialog.set(false);
          this.loadNodes(route.id);
        },
        error: (error) => {
          const detail = error.error?.message || 'Không thể lưu nốt xe';
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail });
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
}
