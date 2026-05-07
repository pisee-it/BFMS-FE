import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { ShiftService } from '../../../core/services/shift.service';
import { NodeService } from '../../../core/services/node.service';
import { BusService } from '../../../core/services/bus.service';
import { RouteService } from '../../../core/services/route.service';
import { NodeResponse } from '../../../core/models/node.model';
import { BusShiftRequest, ShiftResponse, ShiftStatus } from '../../../core/models/shift.model';
import { Bus } from '../../../core/models/bus.model';
import { BusRoute } from '../../../core/models/route.model';

@Component({
  selector: 'app-shift-scheduling',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    TableModule,
    ButtonModule,
    DialogModule,
    SelectModule
  ],
  templateUrl: './shift-scheduling.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShiftSchedulingComponent implements OnInit {
  private readonly shiftService = inject(ShiftService);
  private readonly nodeService = inject(NodeService);
  private readonly busService = inject(BusService);
  private readonly routeService = inject(RouteService);
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);

  // Signals
  routes = signal<BusRoute[]>([]);
  selectedRoute = signal<BusRoute | null>(null);
  nodes = signal<NodeResponse[]>([]);
  selectedNode = signal<NodeResponse | null>(null);
  buses = signal<Bus[]>([]);
  shifts = signal<ShiftResponse[]>([]);
  loading = signal<boolean>(false);

  shiftDialog = signal<boolean>(false);
  shiftForm: FormGroup;
  submitted = false;

  directions = [
    { label: 'A -> B (Chiều đi)', value: 1 },
    { label: 'B -> A (Chiều về)', value: 2 }
  ];

  constructor() {
    this.shiftForm = this.fb.group({
      busId: [null, [Validators.required]],
      driverId: [null, [Validators.required]], // Hiện tại đang giả định ID tài xế
      shiftOrder: [null, [Validators.required, Validators.min(1)]],
      plannedDepartureTime: ['05:00', [Validators.required]],
      plannedArrivalTime: ['06:30', [Validators.required]],
      direction: [1, [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadRoutes();
    this.loadBuses();
    
    // Check for nodeId in query params
    this.route.queryParams.subscribe(params => {
      if (params['nodeId']) {
        this.loadNodeAndShifts(params['nodeId']);
      }
    });
  }

  loadRoutes() {
    this.routeService.getRoutes(0, 100).subscribe({
      next: (response) => this.routes.set(response.content)
    });
  }

  loadBuses() {
    this.busService.getBuses(0, 100).subscribe({
      next: (response) => this.buses.set(response.content)
    });
  }

  onRouteSelect(route: BusRoute) {
    this.selectedRoute.set(route);
    this.nodeService.getNodesByRoute(route.id).subscribe({
      next: (data) => this.nodes.set(data)
    });
  }

  onNodeSelect(node: NodeResponse) {
    this.selectedNode.set(node);
    this.loadShifts(node.id);
  }

  loadNodeAndShifts(nodeId: number) {
    this.nodeService.getNodeById(nodeId).subscribe({
      next: (node) => {
        this.selectedNode.set(node);
        this.shifts.set(node.shifts || []);
      }
    });
  }

  loadShifts(nodeId: number) {
    this.loading.set(true);
    this.nodeService.getNodeById(nodeId).subscribe({
      next: (node) => {
        this.shifts.set(node.shifts || []);
        this.loading.set(false);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể tải danh sách ca chạy' });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    if (!this.selectedNode()) {
      this.messageService.add({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn nốt xe trước' });
      return;
    }
    this.shiftForm.reset({
      busId: null,
      driverId: 1, // Mặc định tài xế ID 1 cho demo
      shiftOrder: this.shifts().length + 1,
      plannedDepartureTime: '05:00',
      plannedArrivalTime: '06:30',
      direction: 1
    });
    this.submitted = false;
    this.shiftDialog.set(true);
  }

  saveShift() {
    this.submitted = true;
    const node = this.selectedNode();

    if (this.shiftForm.valid && node) {
      const shiftData: BusShiftRequest = this.shiftForm.value;
      this.shiftService.createShift(node.id, shiftData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đã lập lịch ca chạy mới' });
          this.shiftDialog.set(false);
          this.loadShifts(node.id);
        },
        error: (error) => {
          const detail = error.error?.message || 'Không thể tạo ca chạy';
          this.messageService.add({ severity: 'error', summary: 'Lỗi', detail });
        }
      });
    }
  }

  getStatusSeverity(status: ShiftStatus): 'success' | 'info' | 'warning' | 'danger' | 'secondary' {
    switch (status) {
      case ShiftStatus.COMPLETED: return 'success';
      case ShiftStatus.RUNNING: return 'info';
      case ShiftStatus.PENDING: return 'warning';
      case ShiftStatus.CANCELLED: return 'danger';
      default: return 'secondary';
    }
  }
}
