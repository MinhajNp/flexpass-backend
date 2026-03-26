import { inject, injectable } from "inversify"

import { IAdminService } from "../interfaces/IAdminService"
import { IUserService } from "../../user/interfaces/IUserService"

import { TYPES } from "../../../core/container/types"

import { UserResponseDTO } from "../../user/dto/user.response.dto"

@injectable()
export class AdminService implements IAdminService {

  constructor(
    @inject(TYPES.IUserService)
    private userService: IUserService
  ) {}

  // -----------------------------------------
  // Get all users
  // -----------------------------------------
  async getAllUsers(): Promise<UserResponseDTO[]> {
    return this.userService.getUsers()
  }

  // -----------------------------------------
  // Block user
  // -----------------------------------------
  async blockUser(userId: string): Promise<UserResponseDTO> {
    return this.userService.blockUser(userId)
  }

  // -----------------------------------------
  // Unblock user
  // -----------------------------------------
  async unblockUser(userId: string): Promise<UserResponseDTO> {
    return this.userService.unblockUser(userId)
  }

}