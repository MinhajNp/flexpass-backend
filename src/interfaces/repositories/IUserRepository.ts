import type { UserStatus } from '../../enums/UserStatus.js';
import type { IUser } from '../../models/userModel.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
  findAllUsers(
    page?: number,
    limit?: number,
  ): Promise<{
    users: IUser[];
    totalCount: number;
  }>;
  updateUserStatus(userId: string, status: UserStatus): Promise<IUser | null>;
  updateVerificationStatus(
    userId: string,
    isVerified: boolean,
  ): Promise<IUser | null>;
}
