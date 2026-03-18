import nodemailer from "nodemailer"
import { injectable } from "inversify"
import { IOtpEmailService } from "./IOtpEmailService"
import { env } from "../../../core/config/env"

@injectable()
export class OtpEmailService implements IOtpEmailService {

  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS
    }
  })

  async sendOtp(email: string, otp: string): Promise<void> {

    await this.transporter.sendMail({
      from: `"FlexPass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "FlexPass OTP Verification",
      html: `
        <h2>FlexPass Verification</h2>
        <p>Your OTP:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 5 minutes.</p>
      `
    })

  }
}