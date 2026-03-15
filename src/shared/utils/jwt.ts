import jwt from "jsonwebtoken"
import { env } from "../../core/config/env"

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: "7d"
  })
}