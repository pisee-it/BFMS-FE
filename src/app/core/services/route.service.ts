import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusRoute, RouteRequest } from '../models/route.model';

@Injectable({
  providedIn: 'root'
})
export class RouteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/routes';

  getRoutes(page: number = 0, size: number = 10, sort?: string, filters?: any): Observable<any> {
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

  getRouteById(id: number): Observable<BusRoute> {
    return this.http.get<BusRoute>(`${this.apiUrl}/${id}`);
  }

  createRoute(route: RouteRequest): Observable<BusRoute> {
    return this.http.post<BusRoute>(this.apiUrl, route);
  }

  updateRoute(id: number, route: RouteRequest): Observable<BusRoute> {
    return this.http.put<BusRoute>(`${this.apiUrl}/${id}`, route);
  }

  deleteRoute(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
