import express, { type Express } from 'express';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/authRoutes.js';
import errorMiddleware from './middlewares/errorHandler.js';

class App {
  public app: Express;

  constructor() {
    this.app = express();

    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandler();
  }

  // ==============================
  // MIDDLEWARE
  // ==============================

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  // ==============================
  // ROUTES
  // ==============================

  private configureRoutes(): void {
    this.app.use('/auth', authRoutes);
  }

  // ==============================
  // ERROR HANDLER
  // ==============================

  private configureErrorHandler(): void {
    this.app.use(errorMiddleware);
  }
}

export default new App().app;
