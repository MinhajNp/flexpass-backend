import bcrypt from 'bcryptjs';
import { Schema } from 'mongoose';
import type { IOtpRepository } from '../interfaces/repositories/IOtpRepository.js';
import emailService from './emailService.js';
import { generateOtp } from '../utils/otp.js';
import { UnauthorizedError } from '../errors/UnauthorizedError.js';
import type { IUserRepository } from '../interfaces/repositories/IUserRepository.js';
import type { IOtpService } from '../interfaces/services/IOtpService.js';
import { ConflictError } from '../errors/ConflictError.js';

const MAX_OTP_ATTEMPTS = 5;

export class OtpService implements IOtpService {
  constructor(
    private otpRepository: IOtpRepository,
    private userRepository: IUserRepository,
  ) {}

  // ==============================
  // SEND OTP
  // ==============================

  async sendOtp(userId: string, email: string): Promise<void> {
    const otp = generateOtp();

    // Store only the hash, never the actual OTP.
    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Convert string ID to MongoDB ObjectId.
    await this.otpRepository.create({
      userId: new Schema.Types.ObjectId(userId),
      otpHash,
      expiresAt,
      attempts: 0,
    });

    await emailService.sendOtp(email, otp);
  }

  // ==============================
  // VERIFY OTP
  // ==============================
  async verifyOtp(userId: string, otp: string): Promise<void> {
    const otpRecord = await this.otpRepository.findByUserId(userId);

    if (!otpRecord) {
      throw new UnauthorizedError('Invalid or expired OTP');
    }

    if (otpRecord.expiresAt < new Date()) {
      await this.otpRepository.deleteById(otpRecord._id.toString());

      throw new UnauthorizedError('OTP has expired');
    }

    if (otpRecord.attempts >= MAX_OTP_ATTEMPTS) {
      await this.otpRepository.deleteById(otpRecord._id.toString());

      throw new UnauthorizedError(
        'Maximum OTP attempts exceeded. Please request a new OTP.',
      );
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otpHash);

    if (!isValid) {
      await this.otpRepository.updateById(otpRecord._id.toString(), {
        attempts: otpRecord.attempts + 1,
      });

      throw new UnauthorizedError('Invalid OTP');
    }

    // OTP can only be used once.
    await this.otpRepository.deleteById(otpRecord._id.toString());

    // Mark the user as verified after successful OTP verification.
    await this.userRepository.updateVerificationStatus(userId, true);
  }

  // ==============================
// RESEND OTP
// ==============================

async resendOtp(userId: string): Promise<void> {
  const user = await this.userRepository.findById(userId);

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  if (user.isVerified) {
    throw new ConflictError('Email is already verified');
  }

  // Remove previous OTP before creating a new one.
  const existingOtp = await this.otpRepository.findByUserId(userId);

  if (existingOtp) {
    await this.otpRepository.deleteById(existingOtp._id.toString());
  }

  await this.sendOtp(userId, user.email);
}
}
