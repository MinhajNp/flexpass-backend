import { UserStatus } from "../../../shared/enums/userStatus.enum"
import { IUser } from "../user.entity"

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>
  createUser(data: Partial<IUser>): Promise<IUser>
  updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>
  findAllUsers(): Promise<IUser[]>
  updateUserStatus(userId: string, status: UserStatus): Promise<IUser | null>
  findById(id: string): Promise<IUser | null>
}