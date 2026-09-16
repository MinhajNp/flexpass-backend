import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';
import type { IOtpRepository } from '../interfaces/repositories/IOtpRepository.js';
import emailService from './emailService.js';
import { generateOtp } from '../utils/otp.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import type { IUserRepository } from '../interfaces/repositories/IUserRepository.js';
import type { IOtpService } from '../interfaces/services/IOtpService.js';
import { ConflictError } from '../errors/ConflictError.js';
import { OtpPurpose } from '../models/otpModel.js';
import { AuthMessages } from '../constants/authMessages.js';

const MAX_OTP_ATTEMPTS = 5;

export class OtpService implements IOtpService {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository,
  ) {}

  // ==============================
  // SEND OTP
  // ==============================

  async sendOtp(
    userId: string,
    email: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const otp = generateOtp();

    // Store only the hash, never the actual OTP.
    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await this.otpRepository.create({
      userId: new Schema.Types.ObjectId(userId),
      otpHash,
      expiresAt,
      attempts: 0,
      purpose,
    });

    await emailService.sendOtp(email, otp);
  }

  // ==============================
  // VERIFY OTP
  // ==============================

  async verifyOtp(
    userId: string,
    otp: string,
    purpose: OtpPurpose,
  ): Promise<void> {
    const otpRecord = await this.otpRepository.findByUserId(userId);

    // OTP must belong to the requested purpose.
    if (!otpRecord || otpRecord.purpose !== purpose) {
      throw new UnauthorizedError(AuthMessages.OTP_INVALID_OR_EXPIRED);
    }

    if (otpRecord.expiresAt < new Date()) {
      await this.otpRepository.deleteById(otpRecord._id.toString());

      throw new UnauthorizedError(AuthMessages.OTP_EXPIRED);
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await this.otpRepository.deleteById(otpRecord._id.toString());

      throw new UnauthorizedError(AuthMessages.OTP_MAX_ATTEMPTS);
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      await this.otpRepository.updateById(otpRecord._id.toString(), {
        attempts: otpRecord.attempts + 1,
      });

      throw new UnauthorizedError(AuthMessages.OTP_INVALID_OR_EXPIRED);
    }

    // OTP can only be used once.
    await this.otpRepository.deleteById(otpRecord._id.toString());

    // Only email-verification OTP should verify the user.
    if (purpose === OtpPurpose.EMAIL_VERIFICATION) {
      await this.userRepository.updateVerificationStatus(userId, true);
    }
  }

  // ==============================
  // RESEND OTP
  // ==============================

  async resendOtp(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedError(AuthMessages.USER_NOT_FOUND);
    }

    if (user.isVerified) {
      throw new ConflictError(AuthMessages.EMAIL_ALREADY_VERIFIED);
    }

    // Remove previous OTP before creating a new one.
    const existingOtp = await this.otpRepository.findByUserId(userId);

    if (existingOtp) {
      await this.otpRepository.deleteById(existingOtp._id.toString());
    }

    await this.sendOtp(userId, user.email, OtpPurpose.EMAIL_VERIFICATION);
  }

  // ==============================
  // FORGOT PASSWORD
  // ==============================

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedError(AuthMessages.USER_NOT_FOUND);
    }

    await this.sendOtp(
      user._id.toString(),
      user.email,
      OtpPurpose.PASSWORD_RESET,
    );
  }
}
