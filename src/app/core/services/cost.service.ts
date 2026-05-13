import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { CostRequest, CostResponse } from '../models/cost.model';

@Injectable({
  providedIn: 'root'
})
export class CostService {
  private readonly api = inject(ApiService);
  private readonly path = '/costs';

  getCosts(routeId?: number, startDate?: string, endDate?: string): Observable<CostResponse[]> {
    let params = new HttpParams();
    if (routeId) params = params.set('routeId', routeId.toString());
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    
    return this.api.get<CostResponse[]>(this.path, params);
  }

  createCost(data: CostRequest): Observable<CostResponse> {
    return this.api.post<CostResponse>(this.path, data);
  }

  updateCost(id: number, data: CostRequest): Observable<CostResponse> {
    return this.api.put<CostResponse>(`${this.path}/${id}`, data);
  }

  deleteCost(id: number): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }
}
