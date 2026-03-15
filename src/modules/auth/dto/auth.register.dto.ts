import { Role } from "../../../enums/role.enum"

export interface RegisterDTO {
  name: string
  email: string
  password: string
  role: Role
}