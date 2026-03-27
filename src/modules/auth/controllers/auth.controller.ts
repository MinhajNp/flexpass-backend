import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { asyncHandler } from "../../../shared/utils/asyncHandler"
import { sendResponse } from "../../../shared/utils/response"
import { clearRefreshTokenCookie, setRefreshTokenCookie } from "../../../shared/utils/cookie.util"

import {
  registerSchema,
  loginSchema,
  verifyOtpSchema,
  resetPasswordSchema,
  forgotPasswordSchema
} from "../validators/auth.validation"

import { IAuthService } from "../interfaces/IAuthService"
import { TYPES } from "../../../core/container/types"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"


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
    try {
      const validatedData = loginSchema.parse(req.body)

      const result = await this.authService.login(validatedData)

      const { user, accessToken, refreshToken } = result

      setRefreshTokenCookie(res, refreshToken)

      sendResponse(res, 200, "Login successful", { user, accessToken })
    } catch (error: any) {
      if (error.statusCode === 401 || error.message?.includes("Invalid email or password") || error.message?.includes("Invalid credentials")) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      throw error;
    }
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
  // Forget Password
  // --------------------------------------------------
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {

    const { email } = forgotPasswordSchema.parse(req.body)

    const result = await this.authService.forgotPassword(email)

    sendResponse(res, HttpStatus.OK, result.message)

  })


  // --------------------------------------------------
  // Resend OTP
  // --------------------------------------------------
   resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return sendResponse(res, 400, "Email is required");
  }

  await this.authService.resendOtp(email);

  return sendResponse(res, 200, "OTP resent successfully");
});


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

    sendResponse(res, HttpStatus.OK, "Password reset successful")

  })


  // --------------------------------------------------
  // RefreshToken
  // --------------------------------------------------
  refreshToken = asyncHandler(async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken

    const result = await this.authService.refreshToken(refreshToken)

    sendResponse(
      res,
      HttpStatus.OK,
      "Token refreshed successfully",
      result
    )

  })


  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  logout = asyncHandler(async (req: Request, res: Response) => {

    clearRefreshTokenCookie(res)

    sendResponse(res, HttpStatus.OK, "Logged out successfully")

  })

}