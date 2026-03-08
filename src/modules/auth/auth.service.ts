import bcrypt from "bcrypt"
import { UserRepository } from "../user/user.repository"
import { IUser } from "../user/user.entity"
import { AppError } from "../../utils/AppError"
import { Role } from "../../enums/role.enum"
import { generateToken } from "../../utils/jwt"
import { generateOTP } from "../../utils/otp"
import { OtpRepository } from "./otp.repository"

export class AuthService {

  private userRepository = new UserRepository()
  private otpRepository = new OtpRepository()

 //   Registration------------------------------------------------------------------------------
  async register(data: {                   
    name: string
    email: string
    password: string
    role: Role
  }): Promise<IUser> {

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError("User already exists", 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword
    })

    return newUser
  }

  //   Login-----------------------------------------------------------------------------------------
    async login(data: { email: string; password: string }): Promise<{ user: IUser; token: string }>{

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

  return { user, token }
}

// send OTP function----------------------------------------------------------------------------
async sendOtp(email: string) {

  const otp = generateOTP()

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes

  await this.otpRepository.saveOtp(email, otp, expiresAt)

  return otp
}

// Verify-OTP-----------------------------------------------------------------------------------------
async verifyOtp(email: string, otp: string) {

  const otpRecord = await this.otpRepository.findByEmail(email)

  if (!otpRecord) {
    throw new AppError("OTP not found or expired", 400)
  }

  if (otpRecord.otp !== otp) {
    throw new AppError("Invalid OTP", 400)
  }

  await this.otpRepository.deleteOtp(email)

  return true
}

// Reset-Password---------------------------------------------------------------------------------------
async resetPassword(email: string, otp: string, newPassword: string) {

  const otpRecord = await this.otpRepository.findByEmail(email)

  if (!otpRecord) {
    throw new AppError("OTP not found or expired", 400)
  }

  if (otpRecord.otp !== otp) {
    throw new AppError("Invalid OTP", 400)
  }

  const user = await this.userRepository.findByEmail(email)

  if (!user) {
    throw new AppError("User not found", 404)
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  user.password = hashedPassword
  await user.save()

  await this.otpRepository.deleteOtp(email)

  return true
}

}