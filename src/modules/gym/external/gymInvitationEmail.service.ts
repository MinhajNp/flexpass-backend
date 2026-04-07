import nodemailer from "nodemailer"
import { injectable } from "inversify"
import { IGymInvitationEmailService } from "../interfaces/IGymInvitationEmailService"
import { env } from "../../../core/config/env"

@injectable()
export class GymInvitationEmailService implements IGymInvitationEmailService {

  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS
    }
  })

  async sendInvitation(email: string, token: string): Promise<void> {

    const link =
      `${env.CLIENT_URL}/complete-registration?token=${token}`

    await this.transporter.sendMail({
      to: email,
      subject: "Gym Application Approved",
      html: `
        <h2>Welcome to FlexPass</h2>

        <p>Your gym application has been approved.</p>

        <p>Complete your registration:</p>

        <a href="${link}">Register your account</a>

        <p>This link expires in 24 hours.</p>
      `
    })
  }

  async sendRejection(email: string, reason: string): Promise<void> {
    const applyLink = `${env.CLIENT_URL}/partner/apply`

    await this.transporter.sendMail({
      to: email,
      subject: "Gym Application Update - FlexPass",
      html: `
        <div style="font-family: sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #d32f2f;">Gym Application Update</h2>
          <p>Hello,</p>
          <p>Thank you for your interest in partnering with <strong>FlexPass</strong>.</p>
          <p>After carefully reviewing your application, we regret to inform you that it has been rejected for the following reason:</p>
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 20px 0; color: #721c24;">
            <strong>Reason:</strong> ${reason}
          </div>
          <p>If you believe this was an error or would like to apply again with updated information, you can do so using the link below:</p>
          <div style="margin: 30px 0;">
            <a href="${applyLink}" style="background-color: #2D5A53; color: white; padding: 12px 25px; text-decoration: none; border-radius: 10px; font-weight: bold;">
              Reapply to Partner
            </a>
          </div>
          <p>Best regards,<br>The FlexPass Team</p>
        </div>
      `
    })
  }
}