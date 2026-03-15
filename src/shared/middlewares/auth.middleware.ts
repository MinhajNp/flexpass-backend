import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import { env } from "../../core/config/env"
import { AppError } from "../utils/AppError"

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError("Authorization token missing", 401)
  }

  const token = authHeader.split(" ")[1]

  try {

    const decoded = jwt.verify(token, env.JWT_SECRET)

    req.user = decoded

    next()

  } catch (error) {
    throw new AppError("Invalid or expired token", 401)
  }
}