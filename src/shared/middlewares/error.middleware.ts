import { Request, Response, NextFunction } from "express"
import { logger } from "../utils/logger"
import { HttpStatus } from "../enums/httpStatus.enum"
import { ErrorMessages } from "../constants/messages/error.messages"

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  logger.error(err)

  const statusCode = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR
  const message = err.message || ErrorMessages.INTERNAL_SERVER_ERROR

  res.status(statusCode).json({
    success: false,
    message
  })
}