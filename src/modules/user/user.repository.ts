import { User, IUser } from "./user.entity"

export class UserRepository {

  async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email })
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = new User(data)
    return user.save()
  }

}