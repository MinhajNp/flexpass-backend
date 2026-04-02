import { ApplyGymDTO } from "../dto/apply.gym.dto"
import { CompleteRegistrationDTO } from "../dto/complete-registration.dto"
import { GymResponseDTO } from "../dto/gym.response.dto"

export interface IGymService {

  // -----------------------------------------
  // Gym Application
  // -----------------------------------------
  applyGym(data: ApplyGymDTO): Promise<GymResponseDTO>

  reapplyGym(id: string): Promise<GymResponseDTO>

  // -----------------------------------------
  // Admin Actions
  // -----------------------------------------
  getPendingGyms(): Promise<GymResponseDTO[]>

  getApprovedGyms(): Promise<GymResponseDTO[]>

  approveGym(id: string): Promise<GymResponseDTO>

  rejectGym(id: string, reason: string): Promise<GymResponseDTO>

  // -----------------------------------------
  // Invitation & Registration
  // -----------------------------------------
  validateInvitation(token: string): Promise<{ email: string }>

  completeRegistration(data: CompleteRegistrationDTO): Promise<void>

}