import { Model } from 'mongoose'
import { injectable } from "inversify"
import { IOtp, Otp } from "../entities/otp.entity"
import { IOtpRepository } from "../interfaces/IOtpRepository"
import { BaseRepository } from "../../../shared/repositories/base.repository"


@injectable()
export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository {

  protected model: Model<IOtp> = Otp

  // ── Domain-specific queries ───────────────────────────────────────────────

  async findByEmail(email: string): Promise<IOtp | null> {
    return this.findOne({ email })
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