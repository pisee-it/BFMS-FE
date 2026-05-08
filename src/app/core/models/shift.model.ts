export enum ShiftStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface BusShiftRequest {
  busId: number;
  driverId: number;
  shiftOrder: number;
  plannedDepartureTime: string;
  plannedArrivalTime: string;
  status: ShiftStatus;
  direction: number;
}

export interface CompleteShiftRequest {
  total_single_tickets: number;
  total_monthly_tickets: number;
}

export interface BusShiftResponse {
  shiftId: number;
  licensePlate: string;
  driverName: string;
  shiftOrder: number;
  plannedDepartureTime: string;
  status: ShiftStatus;
  direction: number;
}

export interface ShiftResponse {
  id: number;
  busLicensePlate: string;
  driverName: string;
  shiftOrder: number;
  status: ShiftStatus;
  shiftRevenue: number;
  plannedDepartureTime: string;
  direction: number;
  singleTicketCount: number;
  monthlyTicketCount: number;
}

// Alias for frontend components using 'ActiveShiftResponse'
export type ActiveShiftResponse = BusShiftResponse;
