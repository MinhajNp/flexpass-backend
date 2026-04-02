import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  OTP_EXPIRY: z.string(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),
  CLIENT_URL: z.string()
})

const parsed = envSchema.parse(process.env)

export const env = {
  PORT: parsed.PORT,
  MONGO_URI: parsed.MONGO_URI,
  JWT_ACCESS_SECRET: parsed.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: parsed.JWT_REFRESH_SECRET,
  OTP_EXPIRY: Number(parsed.OTP_EXPIRY),
  EMAIL_USER: parsed.EMAIL_USER,
  EMAIL_PASS: parsed.EMAIL_PASS,
  CLIENT_URL: parsed.CLIENT_URL
}