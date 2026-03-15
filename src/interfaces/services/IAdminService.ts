import { UserResponseDTO } from "../../modules/user/dto/user.response.dto";

export interface IAdminService{
    getAllUsers(): Promise<UserResponseDTO[]>
}