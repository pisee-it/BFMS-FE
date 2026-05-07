import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouteService } from '../../../../core/services/route.service';
import { ShiftService } from '../../../../core/services/shift.service';
import { BusRoute } from '../../../../core/models/route.model';
import { ActiveShiftResponse } from '../../../../core/models/shift.model';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Bus, Route as RouteIcon, ArrowRight } from 'lucide-angular';

@Component({
  selector: 'app-shift-selection',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SelectModule,
    ButtonModule,
    CardModule,
    LucideAngularModule
  ],
  templateUrl: './shift-selection.html',
  styleUrls: []
})
export class ShiftSelectionComponent {
  private readonly routeService = inject(RouteService);
  private readonly shiftService = inject(ShiftService);
  private readonly router = inject(Router);

  routes = signal<BusRoute[]>([]);
  selectedRoute = signal<BusRoute | null>(null);
  activeShifts = signal<ActiveShiftResponse[]>([]);
  isLoading = signal<boolean>(false);

  readonly BusIcon = Bus;
  readonly RouteIcon = RouteIcon;
  readonly ArrowIcon = ArrowRight;

  constructor() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routeService.getRoutes(0, 100).subscribe(response => {
      this.routes.set(response.content || []);
    });
  }

  onRouteSelect(route: BusRoute) {
    this.selectedRoute.set(route);
    this.loadActiveShifts(route.id);
  }

  loadActiveShifts(routeId: number) {
    this.isLoading.set(true);
    this.shiftService.getActiveShifts(routeId).subscribe({
      next: (data) => {
        this.activeShifts.set(data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  selectShift(shiftId: number) {
    const routeId = this.selectedRoute()?.id;
    if (routeId) {
      this.router.navigate(['/operations/shift-completion', routeId, shiftId]);
    }
  }
}
