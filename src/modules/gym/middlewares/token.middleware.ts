import { Request, Response, NextFunction } from "express"
import container from "../../../core/container/container"
import { TYPES } from "../../../core/container/types"
import { IGymApplicationService } from "../interfaces/IGymApplicationService"
import { asyncHandler } from "../../../shared/utils/asyncHandler"
import { AppError } from "../../../shared/utils/AppError"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"

export const validateRegistrationToken = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const token = (req.query.token as string) || (req.body.token as string)

    if (!token) {
      throw new AppError("Registration token is required", HttpStatus.BAD_REQUEST)
    }

    const gymService = container.get<IGymApplicationService>(TYPES.IGymApplicationService)
    
    // This will throw if invalid or expired
    const result = await gymService.validateRegistrationToken(token)

    // Attach verified gym info to request for later use
    ;(req as any).verifiedGym = result

    next()
  }
)
