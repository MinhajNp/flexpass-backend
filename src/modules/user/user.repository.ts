import { User, IUser } from "./user.entity"
import { IUserRepository } from "../../interfaces/IUserRepository"
import { injectable } from "inversify"

@injectable()
export class UserRepository implements IUserRepository {

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email })
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data)
    return user.save()
  }

  async findAllUsers() {
    return User.find()
  }

  async updateUser(id: string, data: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { new: true })
  }

}