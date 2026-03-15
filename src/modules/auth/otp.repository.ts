import { injectable } from "inversify"
import { Otp, IOtp } from "./otp.entity"
import { IOtpRepository } from "../../interfaces/IOtpRepository"

@injectable()
export class OtpRepository implements IOtpRepository {

  async findByEmail(email: string): Promise<IOtp | null> {
    return Otp.findOne({ email }).lean()
  }

  async saveOtp(
    email: string,
    otp: string,
    expiresAt: Date
  ): Promise<IOtp | null> {

    return Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true }
    ).lean()
  }

  async deleteOtp(email: string): Promise<void> {
    await Otp.deleteOne({ email })
  }

}