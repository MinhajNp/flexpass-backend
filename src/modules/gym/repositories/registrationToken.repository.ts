import { Model } from 'mongoose'
import { injectable } from "inversify"
import { IRegistrationToken, RegistrationToken } from "../entities/registrationToken.entity"
import { IRegistrationTokenRepository } from "../interfaces/IRegistrationTokenRepository"
import { BaseRepository } from "../../../shared/repositories/base.repository"

@injectable()
export class RegistrationTokenRepository
  extends BaseRepository<IRegistrationToken>
  implements IRegistrationTokenRepository {

  protected model: Model<IRegistrationToken> = RegistrationToken

  // ── Domain-specific queries ───────────────────────────────────────────────

  async createToken(data: Partial<IRegistrationToken>): Promise<IRegistrationToken> {
    return this.create(data)
  }

  async findByToken(token: string): Promise<IRegistrationToken | null> {
    return this.findOne({ token, isUsed: false })
  }

  async markAsUsed(tokenId: string): Promise<void> {
    await this.updateById(tokenId, { isUsed: true } as Partial<IRegistrationToken>)
  }

  async deleteExpiredTokens(): Promise<void> {
    await RegistrationToken.deleteMany({ expiresAt: { $lt: new Date() } })
  }
}
