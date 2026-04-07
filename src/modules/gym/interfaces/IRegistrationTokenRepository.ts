import { IRegistrationToken } from "../entities/registrationToken.entity"
import { IBaseRepository } from "../../../shared/repositories/IBaseRepository"

export interface IRegistrationTokenRepository extends IBaseRepository<IRegistrationToken> {
  createToken(data: Partial<IRegistrationToken>): Promise<IRegistrationToken>
  findByToken(token: string): Promise<IRegistrationToken | null>
  markAsUsed(tokenId: string): Promise<void>
  deleteExpiredTokens(): Promise<void>
}
