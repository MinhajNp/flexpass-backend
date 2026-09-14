import type { Request, Response } from 'express';
import type { IAuthService } from '../interfaces/services/IAuthService.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { env } from '../config/env.js';

export class AuthController {
  constructor(private authService: IAuthService) {}

  // Login---------------------------------------------------------------------------------------------------------------
  login = async (req: Request, res: Response): Promise<void> => {
    const { accessToken, refreshToken } = await this.authService.login(
      req.body,
    );

    //set cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json(accessToken);
  };

  // Register-----------------------------------------------------------------------------------------------------------------------------
  register = async (req: Request, res: Response): Promise<void> => {
    const response = await this.authService.register(req.body);
    res.status(HttpStatus.CREATED).json(response);
  };

  // Refresh------------------------------------------------------------------------------------------------------------------------------
  refresh = async (req: Request, res: Response): Promise<void> => {
    const response = await this.authService.refresh(req.cookies.refreshToken);
    res.json(response);
  };

  // Logout--------------------------------------------------------------------------------------------------------------------------------
  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken');

    res.json({
      message: 'Logout successful',
    });
  };
}
