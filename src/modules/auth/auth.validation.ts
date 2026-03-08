import { z } from "zod"
import { Role } from "../../enums/role.enum"

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(Role)
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6)
})

export const sendOtpSchema = z.object({
  email: z.string().email()
})

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6)
})

export const forgotPasswordSchema = z.object({
  email: z.string().email()
})

export const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(6)
})