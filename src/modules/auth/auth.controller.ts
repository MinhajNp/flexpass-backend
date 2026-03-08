import { Request, Response } from "express"
import { AuthService } from "./auth.service"
import { asyncHandler } from "../../utils/asyncHandler"
import { sendResponse } from "../../utils/response"
import { registerSchema, loginSchema } from "./auth.validation"
import { sendOtpSchema, verifyOtpSchema } from "./auth.validation"

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

  const result = await authService.login(validatedData)

  sendResponse(res, 200, "Login successful", result)

})

// Send-OTP-Controller------------------------------------------------------------------------------------
static sendOtp = asyncHandler(async (req: Request, res: Response) => {

  const { email } = sendOtpSchema.parse(req.body)

  const otp = await authService.sendOtp(email)

  // Temporary for development
  console.log("Generated OTP:", otp)

  sendResponse(res, 200, "OTP sent successfully")

})

// Verify-OTP-Controller--------------------------------------------------------------------------------
static verifyOtp = asyncHandler(async (req: Request, res: Response) => {

  const { email, otp } = verifyOtpSchema.parse(req.body)

  await authService.verifyOtp(email, otp)

  sendResponse(res, 200, "OTP verified successfully")

})

}