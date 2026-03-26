import { injectable } from "inversify"
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../../shared/utils/jwt"

import { ITokenService } from "../interfaces/ITokenService"
import { JwtPayload } from "jsonwebtoken"

@injectable()
export class TokenService implements ITokenService {

  generateAccessToken(payload: { userId: string; role: string }): string {
    return generateAccessToken(payload)
  }

  generateRefreshToken(payload: { userId: string; role: string }): string {
    return generateRefreshToken(payload)
  }

  verifyRefreshToken(token: string): { userId: string; role: string } {

    const decoded = verifyRefreshToken(token)

    // type guard
    if (
      typeof decoded === "string" ||
      !decoded ||
      !("userId" in decoded) ||
      !("role" in decoded)
    ) {
      throw new Error("Invalid token payload")
    }

    const payload = decoded as JwtPayload

    return {
      userId: payload.userId as string,
      role: payload.role as string
    }
  }
}