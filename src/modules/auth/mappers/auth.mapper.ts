import { mapUserToResponseDTO } from "../../user/mappers/user.mapper";
import { AuthResponseDTO } from "../dto/auth.response.dto";

export const mapAuthResponseToDTO = (user: any, accessToken: string): AuthResponseDTO => {
  return {
    user: mapUserToResponseDTO(user),
    accessToken
  };
};
