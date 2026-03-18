import { GymStatus } from "../../../enums/gymStatus.enum"

export interface GymResponseDTO {
  id: string
  name: string
  email: string
  phone: string
  location: string
  description?: string
  facilities?: string[]
  documents: string[]
  status: GymStatus
}