export type CostType = 'FUEL' | 'MAINTENANCE' | 'OTHER';

export interface CostRequest {
  routeId: number;
  description: string;
  amount: number;
  costDate: string; // ISO Date string
  costType: CostType;
}

export interface CostResponse {
  id: number;
  routeId: number;
  routeNumber: string;
  description: string;
  amount: number;
  costDate: string;
  costType: CostType;
}
