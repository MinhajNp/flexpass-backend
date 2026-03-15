import { UserRepository } from "../user/user.repository"
import { mapUserToResponseDTO } from "../user/mappers/user.mapper"
import { UserResponseDTO } from "../user/dto/user.response.dto"
import { inject, injectable } from "inversify"
import { IUserRepository } from "../../interfaces/IUserRepository"
import { TYPES } from "../../container/types"
import { IAdminService } from "../../interfaces/services/IAdminService"

@injectable()
export class AdminService implements IAdminService {

  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository
  ) { }


  async getAllUsers(): Promise<UserResponseDTO[]> {

    const users = await this._userRepository.findAllUsers()

    return users.map(mapUserToResponseDTO)

  }

}