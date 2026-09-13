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

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  login = async (data: LoginDTO): Promise<LoginResponseDTO> => {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    const response: LoginResponseDTO = {
      accessToken,
      refreshToken,
    };

    return response;
  };

  register = async (data: RegisterDTO): Promise<RegisterResponseDTO> => {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    // otp verification
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const userData = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: UserRole.USER,
    };

    await this.userRepository.create(userData);

    return {
      message: 'User registered successfully',
    };
  };

  refresh = async (refreshToken: string): Promise<RefreshResponseDTO> => {
    if (!refreshToken) {
      throw new UnauthorizedError('Invalid or expired token');
    }

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
