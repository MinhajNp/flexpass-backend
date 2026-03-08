import bcrypt from "bcrypt"
import { UserRepository } from "../user/user.repository"
import { AppError } from "../../utils/AppError"
import { Role } from "../../enums/role.enum"
import { generateToken } from "../../utils/jwt"
import { generateOTP } from "../../utils/otp"
import { OtpRepository } from "./otp.repository"
import { mapUserToResponseDTO } from "../user/mappers/user.mapper"
import { UserResponseDTO } from "../user/dto/user.response.dto"
import { OTP_EXPIRY_MINUTES, SALT_ROUNDS } from "../../constants/auth.constants"

export class AuthService {

  private userRepository = new UserRepository()
  private otpRepository = new OtpRepository()

  private readonly SALT_ROUNDS = 10

  // --------------------------------------------------
  // Register
  // --------------------------------------------------
  async register(data: {
    name: string
    email: string
    password: string
    role: Role
  }): Promise<UserResponseDTO> {

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError("User already exists", 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword
    })

    return mapUserToResponseDTO(newUser)
  }

  // --------------------------------------------------
  // Login
  // --------------------------------------------------
  async login(data: {
    email: string
    password: string
  }): Promise<{ user: UserResponseDTO; token: string }> {

    const user = await this.userRepository.findByEmail(data.email)

    if (!user) {
      throw new AppError("Invalid email or password", 401)
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
  async sendOtp(email: string): Promise<string> {

    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    await this.otpRepository.saveOtp(email, otp, expiresAt)

    return otp
  }

  // --------------------------------------------------
  // Verify OTP
  // --------------------------------------------------
  async verifyOtp(email: string, otp: string): Promise<boolean> {

    const otpRecord = await this.validateOtp(email, otp)

    await this.otpRepository.deleteOtp(email)

    return true
  }

  // --------------------------------------------------
  // Reset Password
  // --------------------------------------------------
  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<boolean> {

    await this.validateOtp(email, otp)

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError("User not found", 404)
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    user.password = hashedPassword
    await user.save()

    await this.otpRepository.deleteOtp(email)

    return true
  }

  // --------------------------------------------------
  // OTP Validation Helper
  // --------------------------------------------------
  private async validateOtp(email: string, otp: string) {

    const otpRecord = await this.otpRepository.findByEmail(email)

    if (!otpRecord) {
      throw new AppError("OTP not found or expired", 400)
    }

    if (otpRecord.otp !== otp) {
      throw new AppError("Invalid OTP", 400)
    }

    return otpRecord
  }
}