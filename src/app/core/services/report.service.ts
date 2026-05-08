import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RevenueResponse, RouteReportResponse, TicketStatisticsResponse } from '../models/revenue-report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly revenueUrl = '/api/v1/revenue';
  private readonly ticketsUrl = '/api/v1/tickets';
  private readonly reportsUrl = '/api/v1/reports';

  getTotalRevenue(timeframe: 'day' | 'month' | 'year', date?: string): Observable<RevenueResponse> {
    let params = new HttpParams().set('timeframe', timeframe);
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<RevenueResponse>(`${this.revenueUrl}/total`, { params });
  }

  getTicketStatistics(routeId: number, date?: string): Observable<TicketStatisticsResponse> {
    let params = new HttpParams().set('routeId', routeId.toString());
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<TicketStatisticsResponse>(`${this.ticketsUrl}/statistics`, { params });
  }

  getRouteReport(routeId: number, startDate?: string, endDate?: string): Observable<RouteReportResponse> {
    let params = new HttpParams()
      .set('routeId', routeId.toString())
      .set('format', 'json');
    
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get<RouteReportResponse>(`${this.reportsUrl}/export`, { params });
  }

  downloadExcelReport(routeId: number, startDate?: string, endDate?: string): Observable<Blob> {
    let params = new HttpParams()
      .set('routeId', routeId.toString())
      .set('format', 'excel');
    
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);

    return this.http.get(`${this.reportsUrl}/export`, {
      params,
      responseType: 'blob'
    });
  }
}
