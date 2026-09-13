import mongoose from 'mongoose';
import { AppError } from '../errors/AppError.js';
import { HttpStatus } from '../enums/HttpStatus.js';
import type { NextFunction, Request, Response } from 'express';

function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.log(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  } else if (error instanceof mongoose.Error.CastError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      message: error.message,
    });
  } else if (error instanceof Error) {
    return res.status(500).json({
      message: error.message,
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: 'Internal Server Error',
  });
}

export default errorHandler;
