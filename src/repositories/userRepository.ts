import type { CreateUserDTO } from '../dto/auth.dto.js';
import type { IUserRepository } from '../interfaces/repositories/IUserRepository.js';

import User from '../models/user.model.js';

export class UserRepository implements IUserRepository {
  findByEmail = async (email: string) => {
    return await User.findOne({ email });
  };

  create = async (data: CreateUserDTO) => {
    return await User.create(data);
  };

  findById = async (id: string) => {
    return await User.findById(id);
  };
}
