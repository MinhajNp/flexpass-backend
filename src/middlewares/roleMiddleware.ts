import type { NextFunction, Request, Response } from 'express';
import type { UserRole } from '../enums/UserRole.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import { ForbiddenError } from '../errors/ForbiddenError.js';

// Check whether the authenticated user's role is allowed.
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      // User is not authenticated.
      next(new UnauthorizedError('Authentication required'));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      // User is authenticated but does not have permission.
      next(
        new ForbiddenError('You are not authorized to access this resource'),
      );
      return;
    }

    next();
  };
};
