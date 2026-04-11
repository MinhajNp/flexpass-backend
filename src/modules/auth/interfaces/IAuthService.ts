import { Role } from "../../../shared/enums/role.enum"
import { UserResponseDTO } from "../../user/dto/user.response.dto"
import { IUser } from "../../user/entities/user.entity"

export interface IAuthService {

  register(data: {
    name: string
    email: string
    password: string
    role: Role
  }): Promise<{ message: string }>

  login(data: {
    email: string
    password: string
  }): Promise<{
    user: IUser
    accessToken: string
    refreshToken: string
  }>

  googleLogin(idToken: string): Promise<{
    user: IUser
    accessToken: string
    refreshToken: string
  }>

  verifyOtp(
    email: string,
    otp: string
  ): Promise<{ message: string }>

  forgotPassword(email: string): Promise<{ message: string }>
  resendOtp(email: string): Promise<void>
  validateResetOtp(email: string, otp: string): Promise<void>

  resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ message: string }>

  refreshToken(token: string): Promise<{ accessToken: string }>
}