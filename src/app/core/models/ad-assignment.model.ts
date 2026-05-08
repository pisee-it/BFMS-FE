export enum AdAssignmentStatus {
  ACTIVE = 'ACTIVE',
  REMOVED = 'REMOVED'
}

export interface AdAssignment {
  id: number;
  adContractId: number;
  busId: number;
  licensePlate?: string; // Flattened for UI
  adCompanyName?: string; // Flattened for UI
  status: AdAssignmentStatus;
  needsAttention?: boolean; // Derived from contract end date
}

export interface AdAssignmentRequest {
  adContractId: number;
  busId: number;
}
