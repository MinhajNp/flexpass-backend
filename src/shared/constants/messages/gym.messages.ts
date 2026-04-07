export const GymMessages = {

  // ── Application ─────────────────────────────────────────────
  APPLICATION_SUBMITTED:      'Gym application submitted successfully',
  APPLICATION_FETCHED:        'Gym application fetched successfully',
  APPLICATIONS_FETCHED:       'Gym applications fetched successfully',
  APPLICATION_UPDATED:        'Application status updated successfully',
  ALREADY_PENDING:            (status: string) => `A gym application with this email already exists and is currently ${status}.`,
  ALREADY_EXISTS:             (status: string) => `A gym with this email is already ${status}.`,
  REAPPLY_FAILED:             'Failed to reapply gym',

  // ── Approval / Rejection ────────────────────────────────────
  GYM_APPROVED:               'Gym application approved successfully',
  GYM_REJECTED:               'Gym rejected successfully',
  INVALID_APPROVAL_STATE:     'Gym is not in a valid state for approval',
  INVALID_REJECTION_STATE:    'Only pending gyms can be rejected',

  // ── Status ───────────────────────────────────────────────────
  PENDING_GYMS_FETCHED:       'Pending gyms fetched successfully',
  APPROVED_GYMS_FETCHED:      'Approved gyms fetched successfully',

  // ── Reapply ─────────────────────────────────────────────────
  REAPPLY_SUCCESS:            'Gym reapplied successfully',
  REAPPLY_NOT_ALLOWED:        'Only rejected gyms can reapply',

  // ── Registration Flow ────────────────────────────────────────
  REGISTRATION_TOKEN_VALID:   'Registration token is valid',
  REGISTRATION_COMPLETE:      'Gym registration completed successfully',
  INVALID_TOKEN:              'Invalid or expired registration link',
  TOKEN_EXPIRED:              'Registration link has expired',

  // ── Errors ───────────────────────────────────────────────────
  GYM_NOT_FOUND:              'Gym not found',
  GYM_ID_REQUIRED:            'Gym ID is required',
  UPDATE_FAILED:              'Gym update failed',
  TOKEN_REQUIRED:             'Token is required',
  APPLICATION_NOT_FOUND:      'Application not found',
  MISSING_REQUIRED_FIELDS:    'Missing required fields',

  // ── Gym Admin Dashboard ───────────────────────────────────────
  DASHBOARD_STATS_FETCHED:    'Dashboard stats fetched successfully',
  TODAY_SLOTS_FETCHED:        "Today's slots fetched successfully",
  RECENT_CHECKINS_FETCHED:    'Recent check-ins fetched successfully',
  CHECKIN_PROCESSED:          'Check-in processed successfully',

} as const
