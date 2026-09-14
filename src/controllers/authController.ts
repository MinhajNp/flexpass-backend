import type { Request, Response } from 'express';
import type { IAuthService } from '../interfaces/services/IAuthService.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export class AuthController {
  // Dependency Injection
  constructor(private authService: IAuthService) {}

  // ==============================
  // LOGIN
  // ==============================

  login = asyncHandler(async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await this.authService.login(
      req.body,
    );

    // Refresh token is stored in an HTTP-only cookie.
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Access token is returned to the frontend.
    res.json(accessToken);
  });

  // ==============================
  // REGISTER
  // ==============================

  register = asyncHandler(async (req: Request, res: Response) => {
    const response = await this.authService.register(req.body);

    res.status(HttpStatus.CREATED).json(response);
  });

  // ==============================
  // REFRESH TOKEN
  // ==============================

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const response = await this.authService.refresh(
      req.cookies.refreshToken,
    );

    res.json(response);
  });

  // ==============================
  // LOGOUT
  // ==============================

  logout = asyncHandler(async (_req: Request, res: Response) => {
    res.clearCookie('refreshToken');

    res.json({
      message: 'Logout successful',
    });
  });
}