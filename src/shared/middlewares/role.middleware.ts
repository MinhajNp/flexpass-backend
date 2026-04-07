import { Response, NextFunction } from "express"
import { AuthRequest } from "./auth.middleware"
import { AppError } from "../utils/AppError"
import { Role } from "../enums/role.enum"
import { HttpStatus } from "../enums/httpStatus.enum"
import { AuthMessages } from "../constants/messages/auth.messages"

export const authorizeRoles = (...roles: Role[]) => {

  return (req: AuthRequest, res: Response, next: NextFunction) => {

    if (!req.user) {
      throw new AppError(AuthMessages.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError(AuthMessages.FORBIDDEN_INSUFFICIENT, HttpStatus.FORBIDDEN)
    }

    next()
  }

}