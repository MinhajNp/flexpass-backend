import { AdminUserResponseDTO, GymManagementStatsDTO } from "../dto/adminUser.response.dto";

export const mapUserToAdminResponseDTO = (user: any): AdminUserResponseDTO => {
  return {
    id:             user.id || user._id?.toString(),
    name:           user.name,
    email:          user.email,
    role:           user.role,
    status:         user.status === 'ACTIVE' ? 'Active' : (user.status === 'SUSPENDED' ? 'Suspended' : user.status),
    membershipPlan: (user.active_membership && typeof user.active_membership === 'object' && user.active_membership.plan)
      ? user.active_membership.plan
      : 'No Plan',
    expiryDate: (typeof user.active_membership === 'object' && user.active_membership?.expiryDate)
      ? new Date(user.active_membership.expiryDate).toISOString()
      : 'N/A',
    totalCheckins: user.check_in_count || 0,
  };
};

export const mapGymStatsToDTO = (stats: any): GymManagementStatsDTO => {
  return {
    totalGyms: stats.totalGyms || 0,
    premiumCount: stats.premiumCount || 0,
    standardCount: stats.standardCount || 0,
    basicCount: stats.basicCount || 0,
  };
};
