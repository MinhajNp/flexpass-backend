import { injectable, inject } from "inversify";
import { IRoleService } from "../interfaces/IRoleService";
import { IUser } from "../../user/entities/user.entity";
import { Role } from "../../../shared/enums/role.enum";
import { TYPES } from "../../../core/container/types";
import { IGymRepository } from "../../gym/interfaces/IGymRepository";
import { GymStatus } from "../../../shared/enums/gymStatus.enum";

@injectable()
export class RoleService implements IRoleService {
  constructor(
    @inject(TYPES.IGymRepository)
    private gymRepository: IGymRepository
  ) {}

  getDefaultRole(): string {
    return Role.USER;
  }

  async isGymAdminApproved(user: IUser): Promise<boolean> {
    if (user.role !== Role.GYM_ADMIN) {
      return true;
    }

    // For Gym Admins, we check if their gym application is approved.
    // We assume the relationship is via the email.
    const gym = await this.gymRepository.findByEmail(user.email);
    
    if (!gym) {
      // If no gym found by this email, they might be a newly registered gym admin 
      // who hasn't completed their application, or using ownerEmail.
      // Let's also check ownerEmail.
      // (Optimization: we could add a specialized findByAdminEmail to IGymRepository)
      return false;
    }

    return gym.status === GymStatus.APPROVED;
  }

  async getRedirectPath(user: IUser): Promise<string> {
    switch (user.role) {
      case Role.PLATFORM_ADMIN:
        return "/admin";
      case Role.GYM_ADMIN:
        const isApproved = await this.isGymAdminApproved(user);
        return isApproved ? "/gym-admin" : "/gym/pending-approval";
      case Role.USER:
      default:
        return "/dashboard";
    }
  }
}
