export interface SecurityLogResponse {
  id: number;
  userId?: number;
  username?: string;
  action: string;
  details: string;
  ipAddress: string;
  createdAt: string;
}
