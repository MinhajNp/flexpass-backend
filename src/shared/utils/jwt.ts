import jwt from "jsonwebtoken"
import { env } from "../../core/config/env"

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET!, {
    expiresIn: "1m"
  })
}

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d"
  })
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET!)
}