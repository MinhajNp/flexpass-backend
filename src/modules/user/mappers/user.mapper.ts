import { IUser } from "../entities/user.entity"
import { UserResponseDTO } from "../dto/user.response.dto"

export const mapUserToResponseDTO = (user: IUser): UserResponseDTO => {

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    status:user.status,
    active_membership: user.active_membership,
    check_in_count: user.check_in_count || 0
  }

}