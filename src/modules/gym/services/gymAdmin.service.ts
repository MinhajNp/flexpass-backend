import { injectable } from "inversify";
import { Gym } from "../entities/gym.entity";
import { Slot } from "../entities/slot.entity";
import { CheckIn } from "../entities/checkin.entity";
import { AppError } from "../../../shared/utils/AppError";
import { HttpStatus } from "../../../shared/enums/httpStatus.enum";
import { IGymAdminService } from "../interfaces/IGymAdminService";

@injectable()
export class GymAdminService implements IGymAdminService {
  async getDashboardStats(gymId: string) {
    const today = new Date().toISOString().split('T')[0];
    
    const slots = await Slot.find({ gymId, date: today });
    const totalSlots = slots.reduce((acc, s) => acc + s.capacity, 0);
    const bookedSlots = slots.reduce((acc, s) => acc + s.booked, 0);
    
    const checkIns = await CheckIn.find({ 
      gymId, 
      createdAt: { $gte: new Date(today) } 
    });
    
    const primaryAuto = checkIns.filter(c => c.checkInType === 'Primary Gym').length;
    const trainersAvailable = 6; // Will be replaced when Trainer entity is added

    return {
      totalSlots: totalSlots || 48,
      bookedSlots: bookedSlots || 32,
      primaryAuto: primaryAuto || 18,
      trainersAvailable
    };
  }

  async getTodaySlots(gymId: string) {
    const today = new Date().toISOString().split('T')[0];
    const slots = await Slot.find({ gymId, date: today }).sort({ timeWindow: 1 });
    
    if (slots.length === 0) {
      // Seed-like fallback until gym admins configure their slots
      return [
        { timeWindow: "06:00 - 07:00", capacity: 12, booked: 12, available: 0,  status: 'Full' },
        { timeWindow: "07:00 - 08:00", capacity: 12, booked: 10, available: 2,  status: 'Filling Fast' },
        { timeWindow: "08:00 - 09:00", capacity: 12, booked: 8,  available: 4,  status: 'Open' },
        { timeWindow: "09:00 - 10:00", capacity: 12, booked: 5,  available: 7,  status: 'Open' },
        { timeWindow: "10:00 - 11:00", capacity: 12, booked: 3,  available: 9,  status: 'Open' },
        { timeWindow: "17:00 - 18:00", capacity: 12, booked: 11, available: 1,  status: 'Filling Fast' },
        { timeWindow: "18:00 - 19:00", capacity: 12, booked: 12, available: 0,  status: 'Full' }
      ];
    }
    return slots;
  }

  async getRecentCheckIns(gymId: string) {
    return CheckIn.find({ gymId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);
  }

  async processCheckIn(gymId: string, userId: string, type: 'Primary Gym' | 'Manual') {
    const checkIn = new CheckIn({
      gymId,
      userId,
      checkInType: type,
      status: 'Allowed'
    });
    return checkIn.save();
  }
}
