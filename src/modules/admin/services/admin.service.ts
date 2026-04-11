import { inject, injectable } from "inversify"

import { IAdminService, IGymManagementStats, IDashboardStats } from "../interfaces/IAdminService"
import { IGymRepository } from "../../gym/interfaces/IGymRepository"
import { IUserService } from "../../user/interfaces/IUserService"

import { TYPES } from "../../../core/container/types"

import { UserResponseDTO } from "../../user/dto/user.response.dto"
import { GymResponseDTO } from "../../gym/dto/gym.response.dto"
import { Gym } from "../../gym/entities/gym.entity"
import { User } from "../../user/entities/user.entity"
import { CheckIn } from "../../gym/entities/checkin.entity"
import { GymStatus } from "../../../shared/enums/gymStatus.enum"
import { AppError } from "../../../shared/utils/AppError"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { AdminMessages } from "../../../shared/constants/messages/admin.messages"

@injectable()
export class AdminService implements IAdminService {

  constructor(
    @inject(TYPES.IUserService)
    private userService: IUserService,
    @inject(TYPES.IGymRepository)
    private gymRepository: IGymRepository
  ) {}

  // -----------------------------------------
  // Get all users
  // -----------------------------------------
  async getAllUsers(page?: number, limit?: number): Promise<{ users: UserResponseDTO[]; totalCount: number }> {
    return this.userService.getUsers(page, limit)
  }

  // -----------------------------------------
  // Block user
  // -----------------------------------------
  async blockUser(userId: string): Promise<UserResponseDTO> {
    return this.userService.blockUser(userId)
  }

  // -----------------------------------------
  // Unblock user
  // -----------------------------------------
  async unblockUser(userId: string): Promise<UserResponseDTO> {
    return this.userService.unblockUser(userId)
  }

  // -----------------------------------------
  // Gym Management Stats
  // -----------------------------------------
  async getGymManagementStats(): Promise<IGymManagementStats> {
    const stats = await Gym.aggregate([
      { $match: { status: { $in: [GymStatus.APPROVED, GymStatus.SUSPENDED] } } },
      {
        $facet: {
          totalGyms:     [{ $count: "count" }],
          premiumCount:  [{ $match: { category: "PREMIUM"  } }, { $count: "count" }],
          standardCount: [{ $match: { category: "STANDARD" } }, { $count: "count" }],
          basicCount:    [{ $match: { category: "BASIC"    } }, { $count: "count" }]
        }
      }
    ]);

    return {
      totalGyms:     stats[0].totalGyms[0]?.count     || 0,
      premiumCount:  stats[0].premiumCount[0]?.count  || 0,
      standardCount: stats[0].standardCount[0]?.count || 0,
      basicCount:    stats[0].basicCount[0]?.count    || 0,
    };
  }

  // -----------------------------------------
  // Get Partner Gyms (Approved + Suspended)
  // -----------------------------------------
  async getPartnerGyms(page?: number, limit?: number): Promise<{ gyms: GymResponseDTO[]; totalCount: number }> {
    const { gyms, totalCount } = await this.gymRepository.findPartnerGyms(page, limit);

    return {
      gyms: gyms.map((gym: any) => {
        const categoryStr = gym.category || 'BASIC';
        const cat = (categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1).toLowerCase()) as any;
        return {
          id:              gym._id.toString(),
          name:            gym.gymName,
          gymName:         gym.gymName,
          officialEmail:   gym.officialEmail,
          contactPhone:    gym.contactPhone,
          location:        gym.city,
          city:            gym.city,
          fullAddress:     gym.fullAddress,
          documents:       gym.documents as any,
          status:          gym.status,
          createdAt:       (gym as any).createdAt,
          joinedAt:        (gym as any).createdAt?.toISOString(),
          category:        gym.category || 'BASIC',
          isEmergencyMode: gym.isEmergencyMode?.active || false,
        } as unknown as GymResponseDTO;
      }),
      totalCount
    };
  }

  // -----------------------------------------
  // Update Gym Status
  // -----------------------------------------
  async updateGymStatus(gymId: string, action: string): Promise<void> {
    const ACTION_MAP: Record<string, GymStatus> = {
      activate: GymStatus.APPROVED,
      suspend:  GymStatus.SUSPENDED,
    };

    const dbStatus = ACTION_MAP[action.toLowerCase()];
    if (!dbStatus) {
      throw new AppError(AdminMessages.UNKNOWN_ACTION(action), HttpStatus.BAD_REQUEST);
    }

    await Gym.findByIdAndUpdate(gymId, { status: dbStatus });
  }

  // -----------------------------------------
  // Dashboard Stats
  // -----------------------------------------
  async getDashboardStats(): Promise<IDashboardStats> {
    const totalUsers     = await User.countDocuments({ role: 'USER' });
    const activeGyms     = await Gym.countDocuments({ status: GymStatus.APPROVED });

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todaysCheckins = await CheckIn.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    return {
      totalUsers,
      activeGyms,
      todaysCheckins,
      monthlyRevenue:  840000,  // Placeholder until revenue model is implemented
      pendingPayouts:  120000,
    };
  }
}