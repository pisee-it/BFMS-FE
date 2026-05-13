import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApiService } from './api.service';
import { SecurityLogResponse } from '../models/security-log.model';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private readonly api = inject(ApiService);
  private readonly path = '/security-logs';

  getLogs(username?: string, action?: string, page: number = 0, size: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (username) params = params.set('username', username);
    if (action) params = params.set('action', action);

    return this.api.get<any>(this.path, params);
  }
}
