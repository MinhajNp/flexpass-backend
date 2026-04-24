import { Model } from 'mongoose'
import { injectable } from 'inversify'

import { Gym, IGym } from '../entities/gym.entity'
import { GymStatus } from '../../../shared/enums/gymStatus.enum'
import { IGymRepository, IGymManagementStats } from '../interfaces/IGymRepository'
import { BaseRepository } from '../../../shared/repositories/base.repository'

@injectable()
export class GymRepository
  extends BaseRepository<IGym>
  implements IGymRepository {

  protected model: Model<IGym> = Gym

  // ── Domain-specific queries ───────────────────────────────────────────────

  async createGym(data: Partial<IGym>): Promise<IGym> {
    return this.create(data)
  }

  async findByEmail(email: string): Promise<IGym | null> {
    return this.findOne({ officialEmail: email })
  }

  async updateGym(id: string, data: Partial<IGym>): Promise<IGym | null> {
    return this.updateById(id, data)
  }

  async findPendingGyms(): Promise<IGym[]> {
    return Gym.find({ status: { $in: [GymStatus.PENDING, GymStatus.UNDER_REVIEW] } }).lean() as unknown as IGym[]
  }

  async findPartnerGyms(page: number = 1, limit: number = 10): Promise<{ gyms: IGym[]; totalCount: number }> {
    const skip = (page - 1) * limit
    const [gyms, totalCount] = await Promise.all([
      Gym.find({
        status: { $in: [GymStatus.APPROVED, GymStatus.SUSPENDED] }
      }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Gym.countDocuments({ status: { $in: [GymStatus.APPROVED, GymStatus.SUSPENDED] } })
    ])
    return { gyms: gyms as IGym[], totalCount }
  }

  async findApprovedGyms(): Promise<IGym[]> {
    return Gym.find({ status: GymStatus.APPROVED }).lean() as unknown as IGym[]
  }

  async findApplications(page: number = 1, limit: number = 10): Promise<{ applications: IGym[]; totalCount: number }> {
    const skip = (page - 1) * limit
    const query = {
      status: {
        $in: [GymStatus.PENDING, GymStatus.UNDER_REVIEW, GymStatus.REJECTED]
      }
    }
    const [applications, totalCount] = await Promise.all([
      Gym.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Gym.countDocuments(query)
    ])
    return { applications: applications as IGym[], totalCount }
  }

  async findByInvitationToken(token: string): Promise<IGym | null> {
    return this.findOne({ invitationToken: token })
  }

  async clearInvitationToken(gymId: string): Promise<void> {
    await Gym.findByIdAndUpdate(gymId, {
      invitationToken: null,
      invitationTokenExpiresAt: null
    })
  }

  async getManagementStats(): Promise<IGymManagementStats> {
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

  async countByStatus(status: GymStatus): Promise<number> {
    return Gym.countDocuments({ status });
  }
}