import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdContract, AdContractRequest } from '@core/models/ad-contract.model';

@Injectable({
  providedIn: 'root'
})
export class AdContractService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/v1/ads/contracts';

  getContracts(page: number = 0, size: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  getContractById(id: number): Observable<AdContract> {
    return this.http.get<AdContract>(`${this.apiUrl}/${id}`);
  }

  createContract(contract: AdContractRequest): Observable<AdContract> {
    return this.http.post<AdContract>(this.apiUrl, contract);
  }

  updateContract(id: number, contract: AdContractRequest): Observable<AdContract> {
    return this.http.put<AdContract>(`${this.apiUrl}/${id}`, contract);
  }

  deleteContract(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  approveContract(id: number): Observable<AdContract> {
    return this.http.patch<AdContract>(`${this.apiUrl}/${id}/approve`, {});
  }

  requestDeleteContract(id: number): Observable<AdContract> {
    return this.http.patch<AdContract>(`${this.apiUrl}/${id}/request-delete`, {});
  }
}
