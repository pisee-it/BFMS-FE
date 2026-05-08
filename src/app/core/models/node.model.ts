import { ShiftResponse } from './shift.model';

export interface NodeRequest {
  nodeNumber: number;
  executionDate: string;
  description?: string;
}

export interface NodeResponse {
  id: number;
  routeName: string;
  nodeNumber: number;
  executionDate: string;
  totalPassengers: number;
  shifts: ShiftResponse[];
}
