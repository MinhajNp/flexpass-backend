import { UserRole } from '../enums/UserRole.js';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AccessTokenPayload {
  userId: string;
  role: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface RegisterResponseDTO {
  message: string;
}

export interface RefreshTokenPayload {
  userId: string;
}

export interface RefreshResponseDTO {
  accessToken: string;
}
