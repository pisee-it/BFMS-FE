import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NodeRequest, NodeResponse } from '../models/node.model';

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}`;

  getNodesByRoute(routeId: number): Observable<NodeResponse[]> {
    return this.http.get<NodeResponse[]>(`${this.apiUrl}/routes/${routeId}/nodes`);
  }

  getNodeById(nodeId: number): Observable<NodeResponse> {
    return this.http.get<NodeResponse>(`${this.apiUrl}/nodes/${nodeId}`);
  }

  createNode(routeId: number, data: NodeRequest): Observable<NodeResponse> {
    return this.http.post<NodeResponse>(`${this.apiUrl}/routes/${routeId}/nodes`, data);
  }
}
