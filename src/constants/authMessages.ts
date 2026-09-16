export const AuthMessages = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  AUTHORIZATION_HEADER_MISSING: 'Authorization header is missing',
  INVALID_AUTHORIZATION_HEADER: 'Invalid authorization header',
  ACCESS_TOKEN_MISSING: 'Access token is missing',
  AUTHENTICATION_REQUIRED: 'Authentication required',
  NOT_AUTHORIZED: 'You are not authorized to access this resource',
  USER_NOT_FOUND: 'User not found',
  TOKEN_INVALID_OR_EXPIRED: 'Invalid or expired Token',

  OTP_INVALID_OR_EXPIRED: 'Invalid or expired OTP',
  OTP_EXPIRED: 'OTP has expired',
  OTP_MAX_ATTEMPTS: 'Maximum OTP attempts exceeded. Please request a new OTP.',
  EMAIL_ALREADY_VERIFIED: 'Email is already verified',
  OTP_SENT: 'OTP sent successfully',
  OTP_RESENT: 'OTP resent successfully',
  EMAIL_VERIFIED: 'Email verified successfully',

  PASSWORD_RESET_OTP_SENT: 'Password reset OTP sent successfully',
  PASSWORD_RESET_SUCCESS: 'Password reset successfully',

  LOGOUT_SUCCESS: 'Logout successful',
  USER_REGISTERED: 'User registered successfully',
} as const;
