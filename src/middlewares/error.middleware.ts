import type { NextFunction, Request, Response } from 'express';
import AppError from '../errors/app.error.js';
import type { Error } from 'mongoose';

const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export default errorMiddleware;
