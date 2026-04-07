import { ApplyGymDTO } from "../dto/apply.gym.dto"
import { CompleteRegistrationDTO } from "../dto/complete-registration.dto"
import { GymResponseDTO } from "../dto/gym.response.dto"

export interface IGymApplicationService {

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

  getApplications(page?: number, limit?: number): Promise<{ applications: GymResponseDTO[]; totalCount: number }>

  getApplicationById(id: string): Promise<GymResponseDTO | null>

  approveGym(id: string, category: string): Promise<GymResponseDTO>

  rejectGym(id: string, reason: string): Promise<GymResponseDTO>

  updateApplicationStatus(id: string, data: Partial<any>): Promise<GymResponseDTO>

  // -----------------------------------------
  // Registration Flow
  // -----------------------------------------
  generateRegistrationLink(gymId: string): Promise<string>

  validateRegistrationToken(token: string): Promise<{ gymId: string, email: string, gymName: string }>

  completeRegistration(data: CompleteRegistrationDTO): Promise<void>

}
