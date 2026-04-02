
import { IOtp } from "../entities/otp.entity"

export interface IOtpRepository {
  findByEmail(email: string): Promise<IOtp | null>
  saveOtp(email: string, otp: string, expiresAt: Date): Promise<IOtp | null> 
  deleteOtp(email: string):Promise<any>
}