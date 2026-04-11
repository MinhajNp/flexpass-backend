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
  forgotPasswordSchema,
  googleLoginSchema
} from "../validators/auth.validation"

import { IAuthService } from "../interfaces/IAuthService"
import { TYPES } from "../../../core/container/types"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { AuthMessages } from "../../../shared/constants/messages/auth.messages"
import { mapAuthResponseToDTO } from "../mappers/auth.mapper"

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

    sendResponse(res, HttpStatus.CREATED, AuthMessages.USER_REGISTERED, result)

  })


  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  login = asyncHandler(async (req: Request, res: Response) => {
    try {
      const validatedData = loginSchema.parse(req.body)

      const result = await this.authService.login(validatedData )

      const { user, accessToken, refreshToken } = result

      setRefreshTokenCookie(res, refreshToken)

      sendResponse(res, HttpStatus.OK, AuthMessages.LOGIN_SUCCESS, mapAuthResponseToDTO(user, accessToken))
    } catch (error: any) {
      if (error.statusCode === HttpStatus.UNAUTHORIZED || error.message?.includes("Invalid email or password") || error.message?.includes("Invalid credentials")) {
        return res.status(HttpStatus.UNAUTHORIZED).json({ message: AuthMessages.INVALID_CREDENTIALS });
      }
      throw error;
    }
  })


  // --------------------------------------------------
  // Google Login
  // --------------------------------------------------
  googleLogin = asyncHandler(async (req: Request, res: Response) => {

    const { idToken } = googleLoginSchema.parse(req.body)

    const result = await this.authService.googleLogin(idToken)

    const { user, accessToken, refreshToken } = result

    setRefreshTokenCookie(res, refreshToken)

    sendResponse(res, HttpStatus.OK, AuthMessages.GOOGLE_LOGIN_SUCCESS, mapAuthResponseToDTO(user, accessToken))

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

    sendResponse(res, HttpStatus.OK, AuthMessages.OTP_VERIFIED)

  })


  // --------------------------------------------------
  // Validate Reset OTP
  // --------------------------------------------------
  validateResetOtp = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = verifyOtpSchema.parse(req.body)

    await this.authService.validateResetOtp(
      validatedData.email,
      validatedData.otp
    )

    sendResponse(res, HttpStatus.OK, AuthMessages.OTP_VERIFIED)

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
    return sendResponse(res, HttpStatus.BAD_REQUEST, AuthMessages.EMAIL_REQUIRED);
  }

  await this.authService.resendOtp(email);

  return sendResponse(res, HttpStatus.OK, AuthMessages.OTP_RESENT);
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

    sendResponse(res, HttpStatus.OK, AuthMessages.PASSWORD_RESET_SUCCESS)

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
      AuthMessages.TOKEN_REFRESHED,
      result
    )

  })


  // --------------------------------------------------
  // Logout
  // --------------------------------------------------
  logout = asyncHandler(async (req: Request, res: Response) => {

    clearRefreshTokenCookie(res)

    sendResponse(res, HttpStatus.OK, AuthMessages.LOGOUT_SUCCESS)

  })

}