import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { asyncHandler } from "../../utils/asyncHandler"
import { sendResponse } from "../../utils/response"
import { registerSchema } from "./auth.validation"

const authService = new AuthService()

export class AuthController {

  static register = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = registerSchema.parse(req.body)

    const user = await authService.register(validatedData)

    sendResponse(res, 201, "User registered successfully", user)

  })

}