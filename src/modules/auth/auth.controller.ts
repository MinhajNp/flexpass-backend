import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { asyncHandler } from "../../utils/asyncHandler"
import { sendResponse } from "../../utils/response"
import { registerSchema } from "./auth.validation"
import { loginSchema } from "./auth.validation"

const authService = new AuthService()

export class AuthController {

    // Registration-Controller------------------------------------------------------------------------
  static register = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = registerSchema.parse(req.body)

    const user = await authService.register(validatedData)

    sendResponse(res, 201, "User registered successfully", user)

  })
  
//   Login-Controller-----------------------------------------------------------------------------------
static login = asyncHandler(async (req: Request, res: Response) => {

  const validatedData = loginSchema.parse(req.body)

  const user = await authService.login(validatedData)

  sendResponse(res, 200, "Login successful", user)

})

}