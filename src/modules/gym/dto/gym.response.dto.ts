import { GymStatus } from "../../../shared/enums/gymStatus.enum"

export interface GymResponseDTO {
  id: string
  name: string      // Compatibility alias
  gymName: string
  officialEmail: string
  contactPhone: string
  location: string  // Compatibility alias
  city: string
  fullAddress: string
  
  ownerName?: string
  ownerContact?: string
  ownerEmail?: string
  
  description?: string
  facilities?: string[]
  
  documents: {
    name: string
    url: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  }[]
  
  status: GymStatus
  createdAt: Date
  category: 'BASIC' | 'STANDARD' | 'PREMIUM'
}