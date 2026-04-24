import { Model } from 'mongoose'
import { injectable } from 'inversify'

import { CheckIn, ICheckIn } from '../entities/checkin.entity'
import { ICheckInRepository } from '../interfaces/ICheckInRepository'
import { BaseRepository } from '../../../shared/repositories/base.repository'

@injectable()
export class CheckInRepository
  extends BaseRepository<ICheckIn>
  implements ICheckInRepository {

  protected model: Model<ICheckIn> = CheckIn

  async countCheckInsInRange(startDate: Date, endDate: Date): Promise<number> {
    return CheckIn.countDocuments({
      createdAt: { $gte: startDate, $lte: endDate }
    });
  }
}
