import { ICheckIn } from "../entities/checkin.entity";

export interface ICheckInRepository {
  countCheckInsInRange(startDate: Date, endDate: Date): Promise<number>;
}
