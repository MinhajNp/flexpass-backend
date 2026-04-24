import { IGym } from "../entities/gym.entity"
import { GymStatus } from "../../../shared/enums/gymStatus.enum"

export interface IGymManagementStats {
  totalGyms: number;
  premiumCount: number;
  standardCount: number;
  basicCount: number;
}

export interface IGymRepository {
  createGym(data: Partial<IGym>): Promise<IGym>
  findById(id: string): Promise<IGym | null>
  findByEmail(email: string): Promise<IGym | null>
  findPendingGyms(): Promise<IGym[]>
  findApprovedGyms(): Promise<IGym[]>
  findPartnerGyms(page?: number, limit?: number): Promise<{ gyms: IGym[]; totalCount: number }>
  findApplications(page?: number, limit?: number): Promise<{ applications: IGym[]; totalCount: number }>
  updateGym(id: string, data: Partial<IGym>): Promise<IGym | null>
  findByInvitationToken(token: string): Promise<IGym | null>
  clearInvitationToken(gymId: string): Promise<void>
  
  // Statistical methods
  getManagementStats(): Promise<IGymManagementStats>
  countByStatus(status: GymStatus): Promise<number>
}