import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from '@core/services/shift.service';
import { RouteService } from '@core/services/route.service';
import { ActiveShiftResponse, CompleteShiftRequest } from '@core/models/shift.model';
import { BusRoute } from '@core/models/route.model';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Ticket, Banknote, Bus, Info } from 'lucide-angular';

@Component({
  selector: 'app-shift-completion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputNumberModule,
    ButtonModule,
    CardModule,
    LucideAngularModule
  ],
  templateUrl: './shift-completion.html',
  styleUrls: []
})
export class ShiftCompletionComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly shiftService = inject(ShiftService);
  private readonly routeService = inject(RouteService);

  shiftId = signal<number | null>(null);
  routeId = signal<number | null>(null);
  
  shiftInfo = signal<ActiveShiftResponse | null>(null);
  routeInfo = signal<BusRoute | null>(null);

  totalSingleTickets = signal<number>(0);
  totalMonthlyTickets = signal<number>(0);

  ticketPrice = computed(() => this.routeInfo()?.price || 0);
  revenue = computed(() => this.totalSingleTickets() * this.ticketPrice());

  readonly TicketIcon = Ticket;
  readonly MoneyIcon = Banknote;
  readonly BusIcon = Bus;
  readonly InfoIcon = Info;

  ngOnInit() {
    const sId = this.route.snapshot.paramMap.get('shiftId');
    const rId = this.route.snapshot.paramMap.get('routeId');

    if (sId && rId) {
      this.shiftId.set(+sId);
      this.routeId.set(+rId);
      this.loadData(+rId, +sId);
    }
  }

  loadData(routeId: number, shiftId: number) {
    // Fetch route info to get price
    this.routeService.getRouteById(routeId).subscribe(data => {
      this.routeInfo.set(data);
    });

    // Fetch active shifts to find this shift's info
    this.shiftService.getActiveShifts(routeId).subscribe(shifts => {
      const s = shifts.find(x => x.shiftId === shiftId);
      if (s) this.shiftInfo.set(s);
    });
  }

  submit() {
    const sId = this.shiftId();
    if (!sId) return;

    const data: CompleteShiftRequest = {
      total_single_tickets: this.totalSingleTickets(),
      total_monthly_tickets: this.totalMonthlyTickets()
    };

    this.shiftService.completeShift(sId, data).subscribe({
      next: () => {
        // Navigate back or show success
        this.router.navigate(['/operations/shift-selection']);
      },
      error: (err) => {
        console.error('Error completing shift', err);
      }
    });
  }

  cancel() {
    this.router.navigate(['/operations/shift-selection']);
  }
}
