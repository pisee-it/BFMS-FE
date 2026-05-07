export enum BusStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  SOLD = 'SOLD'
}

export interface Bus {
  id: number;
  routeId: number;
  routeNumber: string;
  busModel: string;
  manufacturer: string;
  capacity: number;
  yom: number;
  licensePlate: string;
  status: BusStatus;
  isAdvertised: boolean;
}

export interface BusRequest {
  routeId: number;
  busModel: string;
  manufacturer: string;
  capacity: number;
  yom: number;
  licensePlate: string;
  status: BusStatus;
  isAdvertised: boolean;
}
