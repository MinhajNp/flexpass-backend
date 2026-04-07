import { OAuth2Client } from "google-auth-library"
import { injectable } from "inversify"
import { IGoogleAuthService, ITokenPayload } from "../interfaces/IGoogleAuthService"
import { AppError } from "../../../shared/utils/AppError"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"

@injectable()
export class GoogleAuthService implements IGoogleAuthService {
  private client: OAuth2Client

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }

  async verifyToken(idToken: string): Promise<ITokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      })

      const payload = ticket.getPayload()
      if (!payload) {
        throw new AppError("Invalid Google token", HttpStatus.UNAUTHORIZED)
      }

      const { email, name, picture, sub } = payload

      if (!email) {
        throw new AppError("Email not provided by Google", HttpStatus.UNAUTHORIZED)
      }

      return {
        email,
        name: name || "",
        picture: picture || "",
        sub,
      }
    } catch (error: any) {
      throw new AppError(error.message || "Google token verification failed", HttpStatus.UNAUTHORIZED)
    }
  }
}
