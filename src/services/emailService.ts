import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

class EmailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASSWORD,
    },
  });

  // Send OTP verification email
  async sendOtp(email: string, otp: string): Promise<void> {
    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: 'FlexPass - Email Verification',
      text: `Your FlexPass verification code is ${otp}. It expires in 10 minutes.`,
    });
  }
}

export default new EmailService();
