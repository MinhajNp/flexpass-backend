import type { Request, Response } from 'express';
import type { IAuthService } from '../interfaces/services/IAuthService.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import type { IOtpService } from '../interfaces/services/IOtpService.js';
import { OtpPurpose } from '../models/otpModel.js';

export class AuthController {
  // Dependency Injection
  constructor(
    private authService: IAuthService,
    private otpService: IOtpService,
  ) {}

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
    const response = await this.authService.refresh(req.cookies.refreshToken);

    res.json(response);
  });

  // ==============================
  // VERIFY OTP
  // ==============================

  verifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const { userId, otp } = req.body;

    await this.otpService.verifyOtp(userId, otp, OtpPurpose.EMAIL_VERIFICATION);

    res.json({
      message: 'Email verified successfully',
    });
  });

  // ==============================
  // RESEND OTP
  // ==============================

  resendOtp = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;

    await this.otpService.resendOtp(userId);

    res.json({
      message: 'OTP resent successfully',
    });
  });

  // ==============================
  // FORGOT PASSWORD
  // ==============================

  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    await this.otpService.forgotPassword(req.body.email);

    res.json({
      message: 'Password reset OTP sent successfully',
    });
  });

  // ==============================
  // RESET PASSWORD
  // ==============================

  resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { userId, otp, newPassword } = req.body;

    await this.authService.resetPassword(userId, otp, newPassword);

    res.json({
      message: 'Password reset successfully',
    });
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
