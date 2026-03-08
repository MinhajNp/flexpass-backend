import { IUser } from "../user.entity"
import { UserResponseDTO } from "../dto/user.response.dto"

export const mapUserToResponseDTO = (user: IUser): UserResponseDTO => {

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  }

}