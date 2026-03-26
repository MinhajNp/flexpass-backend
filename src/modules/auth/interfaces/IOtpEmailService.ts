export interface IOtpEmailService {
  sendOtp(email: string, otp: string): Promise<void>
}