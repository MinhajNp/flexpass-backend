import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { env } from "../../core/config/env"
import { AppError } from "../utils/AppError"
import { TYPES } from "../../core/container/types"
import container from "../../core/container/container"
import { IUserStatusService } from "../../modules/auth/interfaces/IUserStatusService"
import { HttpStatus } from "../enums/httpStatus.enum"
import { AuthMessages } from "../constants/messages/auth.messages"

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return next(new AppError(AuthMessages.TOKEN_MISSING, HttpStatus.UNAUTHORIZED))
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded: any = jwt.verify(token, env.JWT_ACCESS_SECRET);
    
    // Real-time status check via centralized service
    const userStatusService = container.get<IUserStatusService>(TYPES.IUserStatusService);
    
    try {
      // Return 401 for real-time session termination as requested
      await userStatusService.checkIfBlocked(decoded.userId, HttpStatus.UNAUTHORIZED);
    } catch (error: any) {
      if (error instanceof AppError && error.message.includes("blocked")) {
        return next(new AppError(error.message, HttpStatus.UNAUTHORIZED));
      }
      throw error;
    }

    req.user = decoded;
    next();

  } catch (error: any) {
    return next(new AppError(error.message || AuthMessages.INVALID_EXPIRED_TOKEN, HttpStatus.UNAUTHORIZED));
  }
}