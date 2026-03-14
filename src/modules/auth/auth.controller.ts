import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { sendResponse } from "../../utils/response"
import { registerSchema, loginSchema } from "./auth.validation"
import { sendOtpSchema, verifyOtpSchema, resetPasswordSchema } from "./auth.validation"

import { IAuthService } from "../../interfaces/services/auth.service.interface"
import { inject, injectable } from "inversify"
import { TYPES } from "../../types/type"


@injectable()
export class AuthController {

  constructor(
    @inject(TYPES.IAuthService)
    private _authService: IAuthService
  ){

  }

    // Registration-Controller------------------------------------------------------------------------
   register = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = registerSchema.parse(req.body)

    const user = await this._authService.register(validatedData)

    sendResponse(res, 201, "User registered successfully", user)

  })
  
//   Login-Controller-----------------------------------------------------------------------------------
 login = asyncHandler(async (req: Request, res: Response) => {

  const validatedData = loginSchema.parse(req.body)

  const result = await this._authService.login(validatedData)

  sendResponse(res, 200, "Login successful", result)

})

// Send-OTP-Controller------------------------------------------------------------------------------------
 sendOtp = asyncHandler(async (req: Request, res: Response) => {

  const { email } = sendOtpSchema.parse(req.body)

  const otp = await this._authService.sendOtp(email)

  // Temporary for development
  console.log("Generated OTP:", otp)

  sendResponse(res, 200, "OTP sent successfully")

})

// Verify-OTP-Controller--------------------------------------------------------------------------------
 verifyOtp = asyncHandler(async (req: Request, res: Response) => {

  const { email, otp } = verifyOtpSchema.parse(req.body)

  await this._authService.verifyOtp(email, otp)

  sendResponse(res, 200, "OTP verified successfully")

})

// Reset-Password-Controller-----------------------------------------------------------------------------
 resetPassword = asyncHandler(async (req: Request, res: Response) => {

  const { email, otp, newPassword } = resetPasswordSchema.parse(req.body)

  await this._authService.resetPassword(email, otp, newPassword)

  sendResponse(res, 200, "Password reset successful")

})

}