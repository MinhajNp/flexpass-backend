import { UserResponseDTO } from "../dto/user.response.dto"
import { Role } from "../../../shared/enums/role.enum"
import { UserStatus } from "../../../shared/enums/userStatus.enum"

export interface IUserService {

  getUsers(page?: number, limit?: number): Promise<{ users: UserResponseDTO[]; totalCount: number }>

  blockUser(userId: string): Promise<UserResponseDTO>

  unblockUser(userId: string): Promise<UserResponseDTO>

  findUserByEmail(email: string): Promise<boolean>

  createOrUpdateGymAdmin(data: {
    email: string
    password: string
    name: string
    role: Role
    status: UserStatus
  }): Promise<void>

}