import bcrypt from 'bcryptjs';
import type {
  LoginDTO,
  LoginResponseDTO,
  RefreshResponseDTO,
  RegisterDTO,
  RegisterResponseDTO,
} from '../dto/auth.dto.js';
import { ConflictError } from '../errors/ConflictError.js';
import { UserRole } from '../enums/UserRole.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import type { IUserRepository } from '../interfaces/repositories/IUserRepository.js';
import type { IAuthService } from '../interfaces/services/IAuthService.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import type { IOtpService } from '../interfaces/services/IOtpService.js';

export class AuthService implements IAuthService {
  // Dependency Injection
  constructor(
    private userRepository: IUserRepository,
    private otpService: IOtpService,
  ) {}

  // ==============================
  // LOGIN
  // ==============================

  login = async (data: LoginDTO): Promise<LoginResponseDTO> => {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      // dont reveal whether the email exists.
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Access token -> short-lived, stored in frontend memory, used for API authentication.
    // Refresh token -> long-lived, stored in an HTTP-only cookie, used for creating new accessToken.
    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    return {
      accessToken,
      refreshToken,
    };
  };

  // ==============================
  // REGISTER
  // ==============================

  register = async (data: RegisterDTO): Promise<RegisterResponseDTO> => {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: UserRole.USER, // New users always start as USER.
    };

    const user = await this.userRepository.create(userData);

    await this.otpService.sendOtp(user._id.toString(), user.email);

    return {
      message: 'User registered successfully',
      userId: user._id.toString(),
    };
  };

  // ==============================
  // REFRESH TOKEN
  // ==============================

  refresh = async (refreshToken: string): Promise<RefreshResponseDTO> => {
    if (!refreshToken) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Refresh token contains only userId, not the full user data.
    const verifiedToken = verifyRefreshToken(refreshToken);

    const user = await this.userRepository.findById(verifiedToken.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
    };
  };
}
