export const AuthMessages = {

  // ── Registration ────────────────────────────────────────────
  USER_ALREADY_EXISTS:        'User already exists',
  REGISTRATION_OTP_SENT:      'OTP sent to email for verification',
  USER_REGISTERED:            'User registered successfully',

  // ── OTP / Verification ──────────────────────────────────────
  OTP_VERIFIED:               'OTP verified successfully',
  OTP_RESENT:                 'OTP resent successfully',
  EMAIL_VERIFIED:             'Email verified successfully',
  EMAIL_REQUIRED:             'Email is required',

  // ── Login ───────────────────────────────────────────────────
  LOGIN_SUCCESS:              'Login successful',
  GOOGLE_LOGIN_SUCCESS:       'Google login successful',
  INVALID_CREDENTIALS:        'Invalid email or password',
  EMAIL_NOT_VERIFIED:         'Please verify your email before login',
  SOCIAL_LOGIN_REQUIRED:      'This account uses social login. Please sign in with Google.',
  AUTH_FAILED:                'Failed to authenticate user',

  // ── Password ────────────────────────────────────────────────
  FORGOT_PASSWORD_OTP_SENT:   'OTP sent successfully',
  PASSWORD_RESET_SUCCESS:     'Password reset successful',

  // ── Tokens ──────────────────────────────────────────────────
  TOKEN_REFRESHED:            'Token refreshed successfully',
  REFRESH_TOKEN_REQUIRED:     'Refresh token required',
  INVALID_REFRESH_TOKEN:      'Invalid refresh token',

  // ── Logout ──────────────────────────────────────────────────
  LOGOUT_SUCCESS:             'Logged out successfully',

  // ── User Lookup ─────────────────────────────────────────────
  USER_NOT_FOUND:             'User not found',

  // ── OTP ───────────────────────────────────────────────────────
  OTP_NOT_FOUND:              'OTP not found or expired',
  OTP_EXPIRED:                'OTP has expired',
  INVALID_OTP:                'Invalid OTP',

  // ── Token Internals ───────────────────────────────────────────
  INVALID_TOKEN_PAYLOAD:      'Invalid token payload',

  // ── User Status ───────────────────────────────────────────────
  USER_BLOCKED:               'User blocked by admin',

  // ── Middleware ─────────────────────────────────────────────────
  TOKEN_MISSING:              'Authorization token missing',
  INVALID_EXPIRED_TOKEN:      'Invalid or expired token',
  UNAUTHORIZED:               'Unauthorized',
  FORBIDDEN_INSUFFICIENT:     'Forbidden: insufficient permissions',

} as const
