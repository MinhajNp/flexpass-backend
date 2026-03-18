import { UserResponseDTO } from "../dto/user.response.dto"

export interface IUserService {

  getUsers(): Promise<UserResponseDTO[]>

  blockUser(userId: string): Promise<UserResponseDTO>

  unblockUser(userId: string): Promise<UserResponseDTO>

}