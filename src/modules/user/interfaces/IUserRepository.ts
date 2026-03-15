import { IUser } from "../user.entity"

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>
  createUser(data: Partial<IUser>): Promise<IUser>
  findAllUsers(): Promise<IUser[]>
  updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>
}