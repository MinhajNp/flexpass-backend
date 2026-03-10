import { UserRepository } from "../user/user.repository"
import { mapUserToResponseDTO } from "../user/mappers/user.mapper"
import { UserResponseDTO } from "../user/dto/user.response.dto"

export class AdminService {

  private userRepository = new UserRepository()

  async getAllUsers(): Promise<UserResponseDTO[]> {

    const users = await this.userRepository.findAllUsers()

    return users.map(mapUserToResponseDTO)

  }

}