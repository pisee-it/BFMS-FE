export interface AuthResponse {
  accessToken: string;
  role: string;
}

export interface User {
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}
