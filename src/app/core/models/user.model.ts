export type UserRole = 'OWNER' | 'ADMIN' | 'STAFF' | 'ACCOUNTANT' | 'ADVERTISING';

export interface UserRequest {
  username: string;
  password?: string;
  fullName: string;
  age: number;
  licenceType?: string;
  avatarUrl?: string;
  role: UserRole;
}

export interface UserResponse {
  id: number;
  username: string;
  fullName: string;
  age: number;
  licenceType: string;
  avatarUrl: string;
  role: UserRole;
}
