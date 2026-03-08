import bcrypt from "bcrypt"
import { UserRepository } from "../user/user.repository"
import { IUser } from "../user/user.entity"
import { AppError } from "../../utils/AppError"
import { Role } from "../../enums/role.enum"
import { generateToken } from "../../utils/jwt"
import { Otp } from "./otp.entity"
import { generateOTP } from "../../utils/otp"

export class AuthService {

  private userRepository = new UserRepository()

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

  await Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  )

  return otp
}

// Verify-OTP-----------------------------------------------------------------------------------------
async verifyOtp(email: string, otp: string) {

  const otpRecord = await Otp.findOne({ email })

  if (!otpRecord) {
    throw new AppError("OTP not found or expired", 400)
  }

  if (otpRecord.otp !== otp) {
    throw new AppError("Invalid OTP", 400)
  }

  await Otp.deleteOne({ email })

  return true
}

}