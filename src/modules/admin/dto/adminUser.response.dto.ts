export interface AdminUserResponseDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  membershipPlan: string;
  expiryDate: string;
  totalCheckins: number;
}

export interface GymManagementStatsDTO {
  totalGyms: number;
  premiumCount: number;
  standardCount: number;
  basicCount: number;
}
