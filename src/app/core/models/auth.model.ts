export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export interface User {
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
