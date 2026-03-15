import { injectable } from "inversify"

import { User, IUser } from "./user.entity"
import { IUserRepository } from "../../interfaces/IUserRepository"

@injectable()
export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email }).lean()
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return User.create(data)
  }

  async findAllUsers(): Promise<IUser[]> {
    return User.find().lean()
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, data, { new: true }).lean()
  }

}