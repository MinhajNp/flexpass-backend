import bcrypt from "bcrypt"
import { inject, injectable } from "inversify"

import { AppError } from "../../shared/utils/AppError"
import { generateToken } from "../../shared/utils/jwt"
import { generateOTP } from "../../shared/utils/otp"

import { UserStatus } from "../../shared/enums/userStatus.enum"

import { OTP_EXPIRY_MINUTES, SALT_ROUNDS } from "../../shared/constants/auth.constants"

import { IUserRepository } from "../user/interfaces/IUserRepository"
import { IOtpRepository } from "./otp/IOtpRepository"
import { IAuthService } from "./interfaces/IAuthService"

import { TYPES } from "../../core/container/types"

import { mapUserToResponseDTO } from "../user/mappers/user.mapper"
import { UserResponseDTO } from "../user/dto/user.response.dto"
import { RegisterDTO } from "./dto/auth.register.dto"
import { LoginDTO } from "./dto/auth.login.dto"
import { IOtpEmailService } from "./email/IOtpEmailService"



@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,

    @inject(TYPES.IOtpRepository)
    private otpRepository: IOtpRepository,

    @inject(TYPES.IOtpEmailService)
    private otpEmailService: IOtpEmailService

  ) {}

  // --------------------------------------------------
  // Register
  // --------------------------------------------------

  async register(data: RegisterDTO): Promise<{ message: string }> {

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError("User already exists", 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
      status: UserStatus.PENDING
    })

    await this.sendOtp(newUser.email)

    return {
      message: "OTP sent to email for verification"
    }
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------

  async login(data: LoginDTO): Promise<{ user: UserResponseDTO; token: string }> {

    const user = await this.userRepository.findByEmail(data.email)

    if (!user) {
      throw new AppError("Invalid email or password", 401)
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError("Please verify your email before login", 403)
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401)
    }

    const token = generateToken({
      userId: user._id,
      role: user.role
    })

    return {
      user: mapUserToResponseDTO(user),
      token
    }
  }

  // --------------------------------------------------
  // Send OTP
  // --------------------------------------------------

  async sendOtp(email: string): Promise<void> {

    const otp = generateOTP()

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    )

    await this.otpRepository.saveOtp(email, otp, expiresAt)

    await this.otpEmailService.sendOtp(email, otp)
  }

  // --------------------------------------------------
  // Verify OTP
  // --------------------------------------------------

  async verifyOtp(
    email: string,
    otp: string
  ): Promise<{ message: string }> {

    await this.validateOtp(email, otp)

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError("User not found", 404)
    }

    await this.userRepository.updateUser(user._id.toString(), {
      status: UserStatus.ACTIVE
    })

    await this.otpRepository.deleteOtp(email)

    return {
      message: "Email verified successfully"
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

    await this.validateOtp(email, otp)

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError("User not found", 404)
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await this.userRepository.updateUser(user._id.toString(), {
      password: hashedPassword
    })

    await this.otpRepository.deleteOtp(email)

    return {
      message: "Password reset successfully"
    }
  }

  // --------------------------------------------------
  // OTP Validation Helper
  // --------------------------------------------------

  private async validateOtp(email: string, otp: string): Promise<void> {

    const otpRecord = await this.otpRepository.findByEmail(email)

    if (!otpRecord) {
      throw new AppError("OTP not found or expired", 400)
    }

    if (otpRecord.expiresAt < new Date()) {
      throw new AppError("OTP expired", 400)
    }

    if (otpRecord.otp !== otp) {
      throw new AppError("Invalid OTP", 400)
    }
  }

}