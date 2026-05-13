import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UserRequest, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly api = inject(ApiService);
  private readonly path = '/users';

  getAllUsers(): Observable<UserResponse[]> {
    return this.api.get<UserResponse[]>(this.path);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.api.get<UserResponse>(`${this.path}/${id}`);
  }

  createUser(data: UserRequest): Observable<UserResponse> {
    return this.api.post<UserResponse>(this.path, data);
  }

  updateUser(id: number, data: UserRequest): Observable<UserResponse> {
    return this.api.put<UserResponse>(`${this.path}/${id}`, data);
  }

  deleteUser(id: number): Observable<void> {
    return this.api.delete<void>(`${this.path}/${id}`);
  }

  getCurrentUser(): Observable<UserResponse> {
    return this.api.get<UserResponse>(`${this.path}/me`);
  }
}
