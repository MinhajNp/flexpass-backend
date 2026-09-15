import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { verifyAccessToken } from '../utils/jwt.js';

// Verifies the access token and attaches the authenticated user to req.user.
export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Authorization header is required for protected routes.
    if (!authHeader) {
      throw new UnauthorizedError('Authorization header is missing');
    }

    // Expected format: "Bearer <accessToken>"
    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Invalid authorization header');
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
      throw new UnauthorizedError('Access token is missing');
    }

    // Verifies the token signature and expiration.
    const payload = verifyAccessToken(token);

    // Make authenticated user information available to later middleware/controllers.
    req.user = payload;

    next();
  } catch (error) {
    // Forward authentication errors to the centralized error handler.
    next(error);
  }
};
