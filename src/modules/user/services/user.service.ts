import { inject, injectable } from "inversify"

import { IUserService } from "../interfaces/IUserService"
import { IUserRepository } from "../interfaces/IUserRepository"

import { TYPES } from "../../../core/container/types"

import { mapUserToResponseDTO } from "../mappers/user.mapper"
import { UserResponseDTO } from "../dto/user.response.dto"

import { UserStatus } from "../../../shared/enums/userStatus.enum"
import { Role } from "../../../shared/enums/role.enum"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"

import { AppError } from "../../../shared/utils/AppError"
import { UserMessages } from "../../../shared/constants/messages/user.messages"

@injectable()
export class UserService implements IUserService {

  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  // -----------------------------------------
  // Get all users
  // -----------------------------------------
  async getUsers(page?: number, limit?: number): Promise<{ users: UserResponseDTO[]; totalCount: number }> {

    const { users, totalCount } = await this.userRepository.findAllUsers(page, limit)

    return {
      users: users.map(mapUserToResponseDTO),
      totalCount
    }
  }

  // -----------------------------------------
  // Block user
  // -----------------------------------------
  async blockUser(userId: string): Promise<UserResponseDTO> {

    const updatedUser = await this.userRepository.updateUser(
      userId,
      { status: UserStatus.BLOCKED }
    )

    if (!updatedUser) {
      throw new AppError(UserMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return mapUserToResponseDTO(updatedUser)
  }

  // -----------------------------------------
  // Unblock user
  // -----------------------------------------
  async unblockUser(userId: string): Promise<UserResponseDTO> {

    const updatedUser = await this.userRepository.updateUser(
      userId,
      { status: UserStatus.ACTIVE }
    )

    if (!updatedUser) {
      throw new AppError(UserMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return mapUserToResponseDTO(updatedUser)
  }

  // -----------------------------------------
  // Find user by email
  // -----------------------------------------
  async findUserByEmail(email: string): Promise<boolean> {

    const user = await this.userRepository.findByEmail(email)

    return !!user
  }

  // -----------------------------------------
  // Create or update gym admin
  // -----------------------------------------
  async createOrUpdateGymAdmin(data: {
    email: string
    password: string
    name: string
    role: Role
    status: UserStatus
  }): Promise<void> {

    const existingUser = await this.userRepository.findByEmail(data.email)

    if (existingUser) {

      await this.userRepository.updateUser(existingUser._id.toString(), {
        password: data.password,
        role: data.role
      })

    } else {

      await this.userRepository.createUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        status: data.status
      })

    }
  }

}