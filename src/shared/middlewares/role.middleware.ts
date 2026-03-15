import { Response, NextFunction } from "express"
import { AuthRequest } from "./auth.middleware"
import { AppError } from "../utils/AppError"
import { Role } from "../enums/role.enum"

export const authorizeRoles = (...roles: Role[]) => {

  return (req: AuthRequest, res: Response, next: NextFunction) => {

    if (!req.user) {
      throw new AppError("Unauthorized", 401)
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError("Forbidden: insufficient permissions", 403)
    }

    next()
  }

}