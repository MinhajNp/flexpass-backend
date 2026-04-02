import { IGym } from "../entities/gym.entity"
import { GymResponseDTO } from "../dto/gym.response.dto"

export const mapGymToResponseDTO = (gym: IGym): GymResponseDTO => {
  return {
    id: gym._id.toString(),
    name: gym.name,
    email: gym.email,
    phone: gym.phone,
    location: gym.location,
    description: gym.description,
    facilities: gym.facilities,
    documents: gym.documents,
    status: gym.status
  }
}