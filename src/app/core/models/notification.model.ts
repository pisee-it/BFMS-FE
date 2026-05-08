export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
