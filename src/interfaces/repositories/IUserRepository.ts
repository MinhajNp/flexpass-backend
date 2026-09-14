import type { CreateUserDTO } from '../../dto/auth.dto.js';
import type { IUser } from '../../models/user.model.js';

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  create(data: CreateUserDTO): Promise<IUser>;
  findById(id: string): Promise<IUser | null>;
}
