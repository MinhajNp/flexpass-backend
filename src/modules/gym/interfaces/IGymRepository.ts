import { IGym } from "../entities/gym.entity"

export interface IGymRepository {
  createGym(data: Partial<IGym>): Promise<IGym>
  findById(id: string): Promise<IGym | null>
  findByEmail(email: string): Promise<IGym | null>
  findPendingGyms(): Promise<IGym[]>
  findApprovedGyms(): Promise<IGym[]>
  updateGym(id: string, data: Partial<IGym>): Promise<IGym | null>
  findByInvitationToken(token: string): Promise<IGym | null>
  clearInvitationToken(gymId: string): Promise<void>
}