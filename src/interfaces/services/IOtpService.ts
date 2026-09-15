export interface IOtpService {
  sendOtp(userId: string, email: string): Promise<void>;
  verifyOtp(userId: string, otp: string): Promise<void>;
  resendOtp(userId: string): Promise<void>;
}