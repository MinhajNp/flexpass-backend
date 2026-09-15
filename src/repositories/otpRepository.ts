import type { IOtpRepository } from '../interfaces/repositories/IOtpRepository.js';
import type { IOtp } from '../models/otpModel.js';
import Otp from '../models/otpModel.js';
import { BaseRepository } from './baseRepository.js';

export class OtpRepository
  extends BaseRepository<IOtp>
  implements IOtpRepository
{
  protected model = Otp;

  // Find the OTP belonging to a user.
  async findByUserId(userId: string): Promise<IOtp | null> {
    return this.findOne({ userId });
  }
}
