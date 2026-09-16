import { Router } from 'express';

import { authController } from '../di/container.js';
import { validate } from '../middlewares/validationMiddleware.js';
import {
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resendOtpSchema,
  resetPasswordSchema,
  verifyOtpSchema,
} from '../validation/authValidation.js';

class AuthRoutes {
  public router: Router;

  constructor() {
    this.router = Router();

    this.configureRoutes();
  }

  // ==============================
  // ROUTES
  // ==============================

  private configureRoutes(): void {
    this.router.post('/login', validate(loginSchema), authController.login);
    this.router.post(
      '/register',
      validate(registerSchema),
      authController.register,
    );
    this.router.post('/refresh', authController.refresh);
    this.router.post(
      '/verify-otp',
      validate(verifyOtpSchema),
      authController.verifyOtp,
    );
    this.router.post(
      '/resend-otp',
      validate(resendOtpSchema),
      authController.resendOtp,
    );
    this.router.post(
      '/forgot-password',
      validate(forgotPasswordSchema),
      authController.forgotPassword,
    );
    this.router.post(
      '/reset-password',
      validate(resetPasswordSchema),
      authController.resetPassword,
    );
    this.router.post('/logout', authController.logout);
  }
}

export default new AuthRoutes().router;
