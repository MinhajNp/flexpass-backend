import bcrypt from "bcrypt"
import { UserRepository } from "../user/user.repository"
import { IUser } from "../user/user.entity"
import { AppError } from "../../utils/AppError"
import { Role } from "../../enums/role.enum"

export class AuthService {

  private userRepository = new UserRepository()

  async register(data: {
    name: string
    email: string
    password: string
    role: Role
  }): Promise<IUser> {

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {
      throw new AppError("User already exists", 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const newUser = await this.userRepository.createUser({
      ...data,
      password: hashedPassword
    })

    return newUser
  }

}