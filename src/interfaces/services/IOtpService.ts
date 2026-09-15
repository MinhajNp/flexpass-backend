import type { OtpPurpose } from '../../models/otpModel.js';

export interface IOtpService {
  sendOtp(userId: string, email: string, purpose: OtpPurpose): Promise<void>;

  verifyOtp(userId: string, otp: string, purpose: OtpPurpose): Promise<void>;

  resendOtp(userId: string): Promise<void>;
  forgotPassword(email: string): Promise<void>;
}
