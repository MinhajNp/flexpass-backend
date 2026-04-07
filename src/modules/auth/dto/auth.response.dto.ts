import { UserResponseDTO } from "../../user/dto/user.response.dto";

export interface AuthResponseDTO {
  user: UserResponseDTO;
  accessToken: string;
}
