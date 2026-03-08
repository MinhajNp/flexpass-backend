import dotenv from "dotenv"
import { z } from "zod"

dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string(),
  JWT_SECRET: z.string(),
  OTP_EXPIRY: z.string()
})

const parsed = envSchema.parse(process.env)

export const env = {
  PORT: parsed.PORT,
  MONGO_URI: parsed.MONGO_URI,
  JWT_SECRET: parsed.JWT_SECRET,
  OTP_EXPIRY: Number(parsed.OTP_EXPIRY)
}