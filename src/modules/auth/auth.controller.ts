import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { asyncHandler } from "../../shared/utils/asyncHandler"
import { sendResponse } from "../../shared/utils/response"

import {
  registerSchema,
  loginSchema,
  sendOtpSchema,
  verifyOtpSchema,
  resetPasswordSchema
} from "./auth.validation"

import { IAuthService } from "./interfaces/IAuthService"
import { TYPES } from "../../core/container/types"


@injectable()
export class AuthController {

  constructor(
    @inject(TYPES.IAuthService)
    private authService: IAuthService
  ) {}

  // --------------------------------------------------
  // Register
  // --------------------------------------------------
  register = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = registerSchema.parse(req.body)

    const result = await this.authService.register(validatedData)

    sendResponse(res, 201, "User registered successfully", result)

  })


  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  login = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = loginSchema.parse(req.body)

    const result = await this.authService.login(validatedData)

    sendResponse(res, 200, "Login successful", result)

  })


  // --------------------------------------------------
  // Send OTP
  // --------------------------------------------------
  sendOtp = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = sendOtpSchema.parse(req.body)

    await this.authService.sendOtp(validatedData.email)

    sendResponse(res, 200, "OTP sent successfully")

  })


  // --------------------------------------------------
  // Verify OTP
  // --------------------------------------------------
  verifyOtp = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = verifyOtpSchema.parse(req.body)

    await this.authService.verifyOtp(
      validatedData.email,
      validatedData.otp
    )

    sendResponse(res, 200, "OTP verified successfully")

  })


  // --------------------------------------------------
  // Reset Password
  // --------------------------------------------------
  resetPassword = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = resetPasswordSchema.parse(req.body)

    await this.authService.resetPassword(
      validatedData.email,
      validatedData.otp,
      validatedData.newPassword
    )

    sendResponse(res, 200, "Password reset successful")

  })

}