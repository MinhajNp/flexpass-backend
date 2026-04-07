import { injectable } from "inversify"
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../../../shared/utils/jwt"

import { ITokenService } from "../interfaces/ITokenService"
import { JwtPayload } from "jsonwebtoken"
import { AuthMessages } from "../../../shared/constants/messages/auth.messages"

@injectable()
export class TokenService implements ITokenService {

  generateAccessToken(payload: { userId: string; role: string; isApproved?: boolean }): string {
    return generateAccessToken(payload)
  }

  generateRefreshToken(payload: { userId: string; role: string; isApproved?: boolean }): string {
    return generateRefreshToken(payload)
  }

  verifyRefreshToken(token: string): { userId: string; role: string; isApproved?: boolean } {

    const decoded = verifyRefreshToken(token)

    // type guard
    if (
      typeof decoded === "string" ||
      !decoded ||
      !("userId" in decoded) ||
      !("role" in decoded)
    ) {
      throw new Error(AuthMessages.INVALID_TOKEN_PAYLOAD)
    }

    const payload = decoded as JwtPayload

    return {
      userId: payload.userId as string,
      role: payload.role as string,
      isApproved: payload.isApproved as boolean | undefined
    }
  }
}