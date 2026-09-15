import { Router } from 'express';

import { authController } from '../di/container.js';

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
    this.router.post('/login', authController.login);
    this.router.post('/register', authController.register);
    this.router.post('/refresh', authController.refresh);
    this.router.post('/verify-otp', authController.verifyOtp);
    this.router.post('/resend-otp', authController.resendOtp);
    this.router.post('/logout', authController.logout);
  }
}

export default new AuthRoutes().router;
