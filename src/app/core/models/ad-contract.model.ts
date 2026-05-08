export enum AdContractStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  REJECTED = 'REJECTED',
  DELETE_REQUESTED = 'DELETE_REQUESTED'
}

export interface AdContract {
  id: number;
  companyId: number;
  companyName?: string; // Flattened for UI
  routeId: number;
  routeNumber?: string; // Flattened for UI
  startDate: string;
  endDate: string;
  pricePerBus: number;
  busQuantity: number;
  approvalStatus: AdContractStatus;
  contractFileUrl: string;
  createdAt: string;
}

export interface AdContractRequest {
  companyId: number;
  routeId: number;
  startDate: string;
  endDate: string;
  pricePerBus: number;
  busQuantity: number;
  contractFileUrl: string;
}
