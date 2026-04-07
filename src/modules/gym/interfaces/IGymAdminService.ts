export interface IGymAdminService {
  getDashboardStats(gymId: string): Promise<{
    totalSlots: number;
    bookedSlots: number;
    primaryAuto: number;
    trainersAvailable: number;
  }>;

  getTodaySlots(gymId: string): Promise<{
    timeWindow: string;
    capacity: number;
    booked: number;
    available: number;
    status: string;
  }[]>;

  getRecentCheckIns(gymId: string): Promise<any[]>;

  processCheckIn(
    gymId: string,
    userId: string,
    type: 'Primary Gym' | 'Manual'
  ): Promise<any>;
}
