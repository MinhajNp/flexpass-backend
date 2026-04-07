import bcrypt from "bcrypt"
import { inject, injectable } from "inversify"

import { AppError } from "../../../shared/utils/AppError"

import { UserStatus } from "../../../shared/enums/userStatus.enum"
import { SALT_ROUNDS } from "../../../shared/constants/auth.constants"

import { IUserRepository } from "../../user/interfaces/IUserRepository"
import { IAuthService } from "../interfaces/IAuthService"
import { IOtpService } from "../interfaces/IOtpService"
import { ITokenService } from "../interfaces/ITokenService"

import { IGoogleAuthService } from "../interfaces/IGoogleAuthService"
import { IRoleService } from "../interfaces/IRoleService"
import { IUserStatusService } from "../interfaces/IUserStatusService"
import { TYPES } from "../../../core/container/types"

import { mapUserToResponseDTO } from "../../user/mappers/user.mapper"
import { UserResponseDTO } from "../../user/dto/user.response.dto"
import { RegisterDTO } from "../dto/auth.register.dto"
import { LoginDTO } from "../dto/auth.login.dto"

import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { AuthMessages } from "../../../shared/constants/messages/auth.messages"

@injectable()
export class AuthService implements IAuthService {

  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository,

    @inject(TYPES.IOtpService)
    private otpService: IOtpService,

    @inject(TYPES.ITokenService)
    private tokenService: ITokenService,

    @inject(TYPES.IGoogleAuthService)
    private googleAuthService: IGoogleAuthService,

    @inject(TYPES.IRoleService)
    private roleService: IRoleService,

    @inject(TYPES.IUserStatusService)
    private userStatusService: IUserStatusService
  ) { }

  // --------------------------------------------------
  // Register
  // --------------------------------------------------
  async register(data: RegisterDTO): Promise<{ message: string }> {

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError(AuthMessages.USER_ALREADY_EXISTS, HttpStatus.BAD_REQUEST)
    }

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS)

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword,
      status: UserStatus.PENDING
    })

    await this.otpService.sendOtp(newUser.email)

    return {
      message: AuthMessages.REGISTRATION_OTP_SENT
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
      throw new AppError(AuthMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED)
    }

    await this.userStatusService.checkIfBlocked(user._id.toString(), HttpStatus.FORBIDDEN);

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError(AuthMessages.EMAIL_NOT_VERIFIED, HttpStatus.FORBIDDEN)
    }

    if (!user.password) {
      throw new AppError(AuthMessages.SOCIAL_LOGIN_REQUIRED, HttpStatus.BAD_REQUEST)
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new AppError(AuthMessages.INVALID_CREDENTIALS, HttpStatus.UNAUTHORIZED)
    }

    const isApproved = await this.roleService.isGymAdminApproved(user)

    const payload = {
      userId: user._id.toString(),
      role: user.role,
      isApproved
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
  // Google Login
  // --------------------------------------------------
  async googleLogin(idToken: string): Promise<{
    user: UserResponseDTO;
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = await this.googleAuthService.verifyToken(idToken);

    let user = await this.userRepository.findByEmail(payload.email);

    if (user) {
      // Update google info if missing
      const updates: any = {};
      if (!user.googleId) updates.googleId = payload.sub;
      if (!user.picture) updates.picture = payload.picture;
      if (user.status !== UserStatus.ACTIVE) {
        updates.status = UserStatus.ACTIVE;
        updates.isVerified = true;
      }

      if (Object.keys(updates).length > 0) {
        user = await this.userRepository.updateUser(user._id.toString(), updates);
      }
    } else {
      // Create new user
      user = await this.userRepository.createUser({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        picture: payload.picture,
        status: UserStatus.ACTIVE,
        isVerified: true,
        role: this.roleService.getDefaultRole() as any
      });
    }

    if (!user) {
      throw new AppError(AuthMessages.AUTH_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    await this.userStatusService.checkIfBlocked(user._id.toString(), HttpStatus.FORBIDDEN);

    const isApproved = await this.roleService.isGymAdminApproved(user)

    const tokenPayload = {
      userId: user._id.toString(),
      role: user.role,
      isApproved
    }

    const accessToken = this.tokenService.generateAccessToken(tokenPayload);
    const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

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
      throw new AppError(AuthMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    await this.userRepository.updateUser(user._id.toString(), {
      status: UserStatus.ACTIVE
    })

    return {
      message: AuthMessages.EMAIL_VERIFIED
    }
  }

  // --------------------------------------------------
  // Forgot Password
  // --------------------------------------------------
  async forgotPassword(email: string): Promise<{ message: string }> {

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError(AuthMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    await this.otpService.sendOtp(email)

    return {
      message: AuthMessages.FORGOT_PASSWORD_OTP_SENT
    }
  }

  // --------------------------------------------------
  // Resend OTP
  // --------------------------------------------------

  async resendOtp(email: string): Promise<void> {
  const user = await this.userRepository.findByEmail(email);

  if (!user) {
    throw new AppError(AuthMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
  }

  // call OtpService
  await this.otpService.sendOtp(email);
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
      throw new AppError(AuthMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)

    await this.userRepository.updateUser(user._id.toString(), {
      password: hashedPassword
    })

    return {
      message: AuthMessages.PASSWORD_RESET_SUCCESS
    }
  }

  // --------------------------------------------------
  // Refresh Token
  // --------------------------------------------------
  async refreshToken(token: string): Promise<{ accessToken: string }> {

    if (!token) {
      throw new AppError(AuthMessages.REFRESH_TOKEN_REQUIRED, HttpStatus.BAD_REQUEST)
    }

    let payload: { userId: string; role: string }

    try {
      payload = this.tokenService.verifyRefreshToken(token)
    } catch {
      throw new AppError(AuthMessages.INVALID_REFRESH_TOKEN, HttpStatus.UNAUTHORIZED)
    }

    // Security Fix: Real-time status check during refresh via UserStatusService
    await this.userStatusService.checkIfBlocked(payload.userId, HttpStatus.FORBIDDEN);

    const accessToken = this.tokenService.generateAccessToken({
      userId: payload.userId,
      role: payload.role
    })

    return { accessToken }
  }
}