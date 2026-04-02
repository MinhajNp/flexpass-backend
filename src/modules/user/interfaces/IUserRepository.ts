import { IUser } from "../entities/user.entity"




export interface IUserRepository {

  findByEmail(email: string): Promise<IUser | null>

  createUser(data: Partial<IUser>): Promise<IUser>

  updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>

  findAllUsers(): Promise<IUser[]>

  findById(id: string): Promise<IUser | null>

}