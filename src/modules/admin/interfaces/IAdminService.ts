import { UserResponseDTO } from "../../user/dto/user.response.dto";
import { GymResponseDTO } from "../../gym/dto/gym.response.dto";

export interface IGymManagementStats {
  totalGyms: number;
  premiumCount: number;
  standardCount: number;
  basicCount: number;
}

export interface IDashboardStats {
  totalUsers: number;
  activeGyms: number;
  todaysCheckins: number;
  monthlyRevenue: number;
  pendingPayouts: number;
}

export interface IAdminService {
  getAllUsers(page?: number, limit?: number): Promise<{ users: UserResponseDTO[]; totalCount: number }>
  blockUser(userId: string): Promise<UserResponseDTO>
  unblockUser(userId: string): Promise<UserResponseDTO>

  // Gym Management
  getGymManagementStats(): Promise<IGymManagementStats>
  getPartnerGyms(page?: number, limit?: number): Promise<{ gyms: GymResponseDTO[]; totalCount: number }>
  updateGymStatus(gymId: string, action: string): Promise<void>

  // Dashboard
  getDashboardStats(): Promise<IDashboardStats>
}