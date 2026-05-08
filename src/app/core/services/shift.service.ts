import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  BusShiftRequest, 
  BusShiftResponse, 
  CompleteShiftRequest, 
  ShiftResponse 
} from '../models/shift.model';

@Injectable({
  providedIn: 'root'
})
export class ShiftService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/shifts`;

  getActiveShifts(routeId: number): Observable<BusShiftResponse[]> {
    return this.http.get<BusShiftResponse[]>(`${this.apiUrl}/active`, {
      params: { routeId: routeId.toString() }
    });
  }

  completeShift(shiftId: number, data: CompleteShiftRequest): Observable<ShiftResponse> {
    return this.http.post<ShiftResponse>(`${this.apiUrl}/${shiftId}/complete`, data);
  }

  createShift(nodeId: number, data: BusShiftRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/node/${nodeId}`, data);
  }
}
