import type { IOtp } from '../../models/otpModel.js';

export interface IOtpRepository {
  create(data: Partial<IOtp>): Promise<IOtp>;
  findById(id: string): Promise<IOtp | null>;
  findByUserId(userId: string): Promise<IOtp | null>;
  findOne(filter: Record<string, unknown>): Promise<IOtp | null>;
  updateById(id: string, data: Partial<IOtp>): Promise<IOtp | null>;
  deleteById(id: string): Promise<void>;
}
