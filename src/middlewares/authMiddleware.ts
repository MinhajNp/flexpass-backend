import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is missing');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Invalid authorization header');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedError('Access token is missing');
    }

    const payload = verifyAccessToken(token);

    req.user = payload;

    next();
  } catch (error) {
    next(error);
  }
};
