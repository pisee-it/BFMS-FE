import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdCompany, AdCompanyRequest } from '@core/models/ad-company.model';

@Injectable({
  providedIn: 'root'
})
export class AdCompanyService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/ads/companies';

  getCompanies(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getCompanyById(id: number): Observable<AdCompany> {
    return this.http.get<AdCompany>(`${this.apiUrl}/${id}`);
  }

  createCompany(company: AdCompanyRequest): Observable<AdCompany> {
    return this.http.post<AdCompany>(this.apiUrl, company);
  }

  updateCompany(id: number, company: AdCompanyRequest): Observable<AdCompany> {
    return this.http.put<AdCompany>(`${this.apiUrl}/${id}`, company);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
