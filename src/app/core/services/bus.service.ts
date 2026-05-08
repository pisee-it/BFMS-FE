import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bus, BusRequest } from '../models/bus.model';

@Injectable({
  providedIn: 'root'
})
export class BusService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/buses';

  getBuses(page: number = 0, size: number = 10, sort?: string, filters?: any): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (sort) {
      params = params.set('sort', sort);
    }

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  getBusById(id: number): Observable<Bus> {
    return this.http.get<Bus>(`${this.apiUrl}/${id}`);
  }

  createBus(bus: BusRequest): Observable<Bus> {
    return this.http.post<Bus>(this.apiUrl, bus);
  }

  updateBus(id: number, bus: BusRequest): Observable<Bus> {
    return this.http.put<Bus>(`${this.apiUrl}/${id}`, bus);
  }

  deleteBus(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
