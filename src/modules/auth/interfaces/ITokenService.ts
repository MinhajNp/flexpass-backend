export interface ITokenService {
  generateAccessToken(payload: { userId: string; role: string; isApproved?: boolean }): string
  generateRefreshToken(payload: { userId: string; role: string; isApproved?: boolean }): string
  verifyRefreshToken(token: string): { userId: string; role: string; isApproved?: boolean }
}