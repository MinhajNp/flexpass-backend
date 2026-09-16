import type {
  LoginDTO,
  LoginResponseDTO,
  RefreshResponseDTO,
  RegisterDTO,
  RegisterResponseDTO,
} from '../../dto/auth.dto.js';

export interface IAuthService {
  login(data: LoginDTO): Promise<LoginResponseDTO>;
  register(data: RegisterDTO): Promise<RegisterResponseDTO>;
  refresh(refreshToken: string): Promise<RefreshResponseDTO>;
  resetPassword(
    userId: string,
    otp: string,
    newPassword: string,
  ): Promise<void>;
  // logout():Promise<void>
}
