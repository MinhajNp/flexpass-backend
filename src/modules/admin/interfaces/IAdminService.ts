import { UserResponseDTO } from "../../user/dto/user.response.dto";

export interface IAdminService {

  getAllUsers(): Promise<UserResponseDTO[]>

  blockUser(userId: string): Promise<UserResponseDTO>

  unblockUser(userId: string): Promise<UserResponseDTO>

}