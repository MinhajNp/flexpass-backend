import { Model } from 'mongoose'
import { injectable } from 'inversify'

import { User, IUser } from '../entities/user.entity'
import { IUserRepository } from '../interfaces/IUserRepository'
import { Role } from '../../../shared/enums/role.enum'
import { UserStatus } from '../../../shared/enums/userStatus.enum'
import { BaseRepository } from '../../../shared/repositories/base.repository'

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository {

  protected model: Model<IUser> = User

  // ── Domain-specific queries ───────────────────────────────────────────────

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email })
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return this.create(data)
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return this.updateById(id, data)
  }

  async findAllUsers(page: number = 1, limit: number = 10): Promise<{ users: IUser[]; totalCount: number }> {
    const skip = (page - 1) * limit
    const [users, totalCount] = await Promise.all([
      User.find({ role: Role.USER }).skip(skip).limit(limit).lean(),
      User.countDocuments({ role: Role.USER })
    ])
    return { users: users as IUser[], totalCount }
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<IUser | null> {
    return User.findByIdAndUpdate(userId, { status }, { new: true }).lean() as unknown as IUser | null
  }
}