import { z } from 'zod';

// ==============================
// REGISTER
// ==============================

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

// ==============================
// LOGIN
// ==============================

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

// ==============================
// VERIFY OTP
// ==============================

export const verifyOtpSchema = z.object({
  userId: z.string(),
  otp: z.string().length(6),
});

// ==============================
// RESEND OTP
// ==============================

export const resendOtpSchema = z.object({
  userId: z.string(),
});

// ==============================
// FORGOT PASSWORD
// ==============================

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

// ==============================
// RESET PASSWORD
// ==============================

export const resetPasswordSchema = z.object({
  userId: z.string(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
});
