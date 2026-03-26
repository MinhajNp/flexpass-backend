import bcrypt from "bcrypt"
import { inject, injectable } from "inversify"

import { AppError } from "../../../shared/utils/AppError"

import { UserStatus } from "../../../shared/enums/userStatus.enum"
import { SALT_ROUNDS } from "../../../shared/constants/auth.constants"

import { IUserRepository } from "../../user/interfaces/IUserRepository"
import { IAuthService } from "../interfaces/IAuthService"
import { IOtpService } from "../interfaces/IOtpService"
import { ITokenService } from "../interfaces/ITokenService"

import { TYPES } from "../../../core/container/types"

import { mapUserToResponseDTO } from "../../user/mappers/user.mapper"
import { UserResponseDTO } from "../../user/dto/user.response.dto"
import { RegisterDTO } from "../dto/auth.register.dto"
import { LoginDTO } from "../dto/auth.login.dto"

import { HttpStatus } from "../../../shared/enums/httpStatus.enum"

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,

    @inject(TYPES.IOtpService)
    private otpService: IOtpService,

    @inject(TYPES.ITokenService)
    private tokenService: ITokenService
  ) {}

  // --------------------------------------------------
  // Register
  // --------------------------------------------------
  async register(data: RegisterDTO): Promise<{ message: string }> {

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError("User already exists", HttpStatus.BAD_REQUEST)
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
      status: UserStatus.PENDING
    })

    await this.otpService.sendOtp(newUser.email)

    return {
      message: "OTP sent to email for verification"
    }
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  async login(
    data: LoginDTO
  ): Promise<{
    user: UserResponseDTO
    accessToken: string
    refreshToken: string
  }> {

    const user = await this.userRepository.findByEmail(data.email)

    if (!user) {
      throw new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED)
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError("Please verify your email before login", HttpStatus.FORBIDDEN)
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED)
    }

    const payload = {
      userId: user._id.toString(),
      role: user.role
    }

    const accessToken = this.tokenService.generateAccessToken(payload)
    const refreshToken = this.tokenService.generateRefreshToken(payload)

    return {
      user: mapUserToResponseDTO(user),
      accessToken,
      refreshToken
    }
  }

  // --------------------------------------------------
  // Verify OTP (for registration)
  // --------------------------------------------------
  async verifyOtp(email: string, otp: string): Promise<{ message: string }> {

    await this.otpService.verifyOtp(email, otp)

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND)
    }

    await this.userRepository.updateUser(user._id.toString(), {
      status: UserStatus.ACTIVE
    })

    return {
      message: "Email verified successfully"
    }
  }

  // --------------------------------------------------
  // Forgot Password
  // --------------------------------------------------
  async forgotPassword(email: string): Promise<{ message: string }> {

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND)
    }

    await this.otpService.sendOtp(email)

    return {
      message: "OTP sent successfully"
    }
  }

  // --------------------------------------------------
  // Reset Password
  // --------------------------------------------------
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }> {

    await this.otpService.verifyOtp(email, otp)

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND)
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await this.userRepository.updateUser(user._id.toString(), {
      password: hashedPassword
    })

    return {
      message: "Password reset successful"
    }
  }

  // --------------------------------------------------
  // Refresh Token
  // --------------------------------------------------
  async refreshToken(token: string): Promise<{ accessToken: string }> {

    if (!token) {
      throw new AppError("Refresh token required", HttpStatus.BAD_REQUEST)
    }

    let payload: { userId: string; role: string }

    try {
      payload = this.tokenService.verifyRefreshToken(token)
    } catch {
      throw new AppError("Invalid refresh token", HttpStatus.UNAUTHORIZED)
    }

    const accessToken = this.tokenService.generateAccessToken({
      userId: payload.userId,
      role: payload.role
    })

    return { accessToken }
  }
}