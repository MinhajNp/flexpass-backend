import { injectable } from "inversify"
import { Otp, IOtp } from "./otp.entity"

@injectable()
export class OtpRepository {

  async findByEmail(email: string): Promise<IOtp | null> {
    return Otp.findOne({ email })
  }

  async saveOtp(email: string, otp: string, expiresAt: Date): Promise<IOtp | null> {
    return Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    )
  }

  async deleteOtp(email: string):Promise<any> {
    return Otp.deleteOne({ email })
  }

}