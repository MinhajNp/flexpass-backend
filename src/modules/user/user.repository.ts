import { injectable } from "inversify"

import { User, IUser } from "./user.entity"
import { IUserRepository } from "./interfaces/IUserRepository"
import { Role } from "../../shared/enums/role.enum"
import { UserStatus } from "../../shared/enums/userStatus.enum"

@injectable()
export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean()
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return User.create(data)
  }

  async findAllUsers(): Promise<IUser[]> {
    return User.find({role:Role.USER}).lean()
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true }).lean()
  }

   async findById(userId: string): Promise<IUser | null> {
    return User.findById(userId).lean()
  }

  async updateUserStatus(userId: string, status: UserStatus): Promise<IUser | null> {
  return User.findByIdAndUpdate(
    userId,
    { status },
    { new: true }
  )
}




}