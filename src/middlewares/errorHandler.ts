import mongoose from 'mongoose';

import { AppError } from '../errors/AppError.js';
import { HttpStatus } from '../enums/HttpStatus.js';

import type { NextFunction, Request, Response } from 'express';

// Centralized error handling
function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.log(error);

  // Custom application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  // Mongoose schema validation errors
  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }

  // Invalid MongoDB ObjectId or type conversion
  if (error instanceof mongoose.Error.CastError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  }

  // Unexpected JavaScript errors
  if (error instanceof Error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }

  // Fallback for non-Error values
  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
  });
}

export default errorHandler;
