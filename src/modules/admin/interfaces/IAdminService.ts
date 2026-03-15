import { UserResponseDTO } from "../../user/dto/user.response.dto";

export interface IAdminService{
    getAllUsers(): Promise<UserResponseDTO[]>
}