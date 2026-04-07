export const AdminMessages = {

  // ── Gym Management ───────────────────────────────────────────
  GYM_STATS_FETCHED:          'Gym stats fetched successfully',
  PARTNER_GYMS_FETCHED:       'Partner gyms fetched successfully',
  GYM_STATUS_UPDATED:         'Gym status updated',
  UNKNOWN_ACTION:             (action: string) => `Unknown action: ${action}`,

  // ── User Management ──────────────────────────────────────────
  USERS_FETCHED:              'Users fetched successfully',
  USER_STATUS_UPDATED:        'User status updated successfully',

  // ── Dashboard ────────────────────────────────────────────────
  DASHBOARD_STATS_FETCHED:    'Dashboard stats fetched successfully',

} as const
