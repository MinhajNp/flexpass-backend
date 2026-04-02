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
      `${env.CLIENT_URL}/gym-register?token=${token}`

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
}