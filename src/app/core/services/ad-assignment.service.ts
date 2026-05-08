import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdAssignment, AdAssignmentRequest } from '@core/models/ad-assignment.model';

@Injectable({
  providedIn: 'root'
})
export class AdAssignmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/ads/assignments';

  getAssignments(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  createAssignment(assignment: AdAssignmentRequest): Observable<AdAssignment> {
    return this.http.post<AdAssignment>(this.apiUrl, assignment);
  }
}
