import { IGym } from "../entities/gym.entity"
import { GymResponseDTO } from "../dto/gym.response.dto"

export const mapGymToResponseDTO = (gym: IGym): GymResponseDTO => {
  return {
    id: gym._id.toString(),
    name: gym.gymName || (gym as any).name,
    gymName: gym.gymName || (gym as any).name,
    officialEmail: gym.officialEmail || (gym as any).email,
    contactPhone: gym.contactPhone,
    location: gym.city || (gym as any).location,
    city: gym.city || (gym as any).location,
    fullAddress: gym.fullAddress,
    ownerName: gym.ownerName,
    ownerContact: gym.ownerContact,
    ownerEmail: gym.ownerEmail,
    description: gym.description,
    facilities: gym.facilities,
    documents: gym.documents,
    status: gym.status,
    category: gym.category,
    createdAt: (gym as any).createdAt
  }
}