export interface RevenueResponse {
  totalTicketRevenue: number;
  totalAdRevenue: number;
  taxDeduction: number;
  netProfit: number;
  totalPassengers: number;
  timeframe: 'DAILY' | 'MONTHLY' | 'YEARLY';
  date: string;
}

export interface RouteReportResponse {
  routeId: number;
  routeName: string;
  routeNumber: string;
  totalTicketRevenue: number;
  totalAdRevenue: number;
  totalPassengers: number;
  taxDeduction: number;
  netProfit: number;
  startDate: string;
  endDate: string;
}

export interface TicketStatisticsResponse {
  routeId: number;
  routeName: string;
  reportDate: string;
  singleTicketCount: number;
  monthlyTicketCount: number;
  totalPassengers: number;
  revenueSingleTickets: number;
}
