import { inject, injectable } from "inversify"
import bcrypt from "bcrypt"

import { IOtpRepository } from "../interfaces/IOtpRepository"
import { IOtpEmailService } from "../interfaces/IOtpEmailService"

import { TYPES } from "../../../core/container/types"

import { generateOTP } from "../../../shared/utils/otp"
import { AppError } from "../../../shared/utils/AppError"

import { OTP_EXPIRY_MINUTES, SALT_ROUNDS } from "../../../shared/constants/auth.constants"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { IOtpService } from "../interfaces/IOtpService"
import { AuthMessages } from "../../../shared/constants/messages/auth.messages"

@injectable()
export class OtpService implements IOtpService {

  constructor(
    @inject(TYPES.IOtpRepository)
    private otpRepository: IOtpRepository,

    @inject(TYPES.IOtpEmailService)
    private otpEmailService: IOtpEmailService
  ) {}

  // --------------------------------------------------
  // Send OTP
  // --------------------------------------------------
  async sendOtp(email: string): Promise<void> {

    const otp = generateOTP()

    const hashedOtp = await bcrypt.hash(otp, SALT_ROUNDS)

    const expiresAt = new Date(
      Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000
    )

    // ensure only one OTP per email (overwrite or delete old)
    await this.otpRepository.deleteOtp(email)

    await this.otpRepository.saveOtp(email, hashedOtp, expiresAt)

    await this.otpEmailService.sendOtp(email, otp)
  }

  // --------------------------------------------------
  // Verify OTP
  // --------------------------------------------------
  async verifyOtp(email: string, otp: string): Promise<void> {

    const otpRecord = await this.otpRepository.findByEmail(email)

    if (!otpRecord) {
      throw new AppError(AuthMessages.OTP_NOT_FOUND, HttpStatus.BAD_REQUEST)
    }

    if (otpRecord.expiresAt < new Date()) {
      await this.otpRepository.deleteOtp(email)
      throw new AppError(AuthMessages.OTP_EXPIRED, HttpStatus.BAD_REQUEST)
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp)

    if (!isValid) {
      throw new AppError(AuthMessages.INVALID_OTP, HttpStatus.BAD_REQUEST)
    }

    // OTP is valid → delete it (prevents reuse)
    await this.otpRepository.deleteOtp(email)
  }

  // --------------------------------------------------
  // Validate OTP (without deletion)
  // --------------------------------------------------
  async validateOtp(email: string, otp: string): Promise<void> {

    const otpRecord = await this.otpRepository.findByEmail(email)

    if (!otpRecord) {
      throw new AppError(AuthMessages.OTP_NOT_FOUND, HttpStatus.BAD_REQUEST)
    }

    if (otpRecord.expiresAt < new Date()) {
      await this.otpRepository.deleteOtp(email)
      throw new AppError(AuthMessages.OTP_EXPIRED, HttpStatus.BAD_REQUEST)
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp)

    if (!isValid) {
      throw new AppError(AuthMessages.INVALID_OTP, HttpStatus.BAD_REQUEST)
    }
  }
}