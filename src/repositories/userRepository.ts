import type { Model } from 'mongoose';

import type { IUserRepository } from '../interfaces/repositories/IUserRepository.js';
import User, { type IUser } from '../models/userModel.js';
import { BaseRepository } from './baseRepository.js';
import type { UserStatus } from '../enums/UserStatus.js';

export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  protected model: Model<IUser> = User;

  // ==============================
  // FIND BY EMAIL
  // ==============================

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email });
  }

  // ==============================
  // FIND ALL USERS
  // ==============================

  async findAllUsers(
    page = 1,
    limit = 10,
  ): Promise<{ users: IUser[]; totalCount: number }> {
    const skip = (page - 1) * limit;

    const [users, totalCount] = await Promise.all([
      this.model.find().skip(skip).limit(limit).lean<IUser[]>(),
      this.model.countDocuments(),
    ]);

    return {
      users,
      totalCount,
    };
  }

  // ==============================
  // UPDATE USER STATUS
  // ==============================

  async updateUserStatus(
    userId: string,
    status: UserStatus,
  ): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(userId, { status }, { new: true });
  }

  // ==============================
  // UPDATE VERIFICATION STATUS
  // ==============================

  async updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<IUser | null> {
    return this.model.findByIdAndUpdate(userId, { isVerified }, { new: true });
  }
}
