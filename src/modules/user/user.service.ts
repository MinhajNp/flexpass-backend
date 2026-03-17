import { inject, injectable } from "inversify"

import { IUserService } from "./interfaces/IUserService"
import { IUserRepository } from "./interfaces/IUserRepository"

import { TYPES } from "../../core/container/types"

import { mapUserToResponseDTO } from "./mappers/user.mapper"
import { UserResponseDTO } from "./dto/user.response.dto"

import { UserStatus } from "../../shared/enums/userStatus.enum"
import { Role } from "../../shared/enums/role.enum"
import { HttpStatus } from "../../shared/enums/httpStatus.enum"

import { AppError } from "../../shared/utils/AppError"

@injectable()
export class UserService implements IUserService {

  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  // -----------------------------------------
  // Get all users
  // -----------------------------------------

  async getUsers(): Promise<UserResponseDTO[]> {

    const users = await this.userRepository.findAllUsers()

    return users.map(mapUserToResponseDTO)
  }

  // -----------------------------------------
  // Block user
  // -----------------------------------------

  async blockUser(userId: string): Promise<UserResponseDTO> {

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND)
    }

    const updatedUser = await this.userRepository.updateUserStatus(
      userId,
      UserStatus.SUSPENDED
    )

    if (!updatedUser) {
      throw new AppError("Failed to block user", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return mapUserToResponseDTO(updatedUser)
  }

  // -----------------------------------------
  // Unblock user
  // -----------------------------------------

  async unblockUser(userId: string): Promise<UserResponseDTO> {

    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND)
    }

    const updatedUser = await this.userRepository.updateUserStatus(
      userId,
      UserStatus.ACTIVE
    )

    if (!updatedUser) {
      throw new AppError("Failed to unblock user", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return mapUserToResponseDTO(updatedUser)
  }

}