
import { IOtp } from "../entities/otp.entity"
import { IBaseRepository } from "../../../shared/repositories/IBaseRepository"

export interface IOtpRepository extends IBaseRepository<IOtp> {
  findByEmail(email: string): Promise<IOtp | null>
  saveOtp(email: string, otp: string, expiresAt: Date): Promise<IOtp | null> 
  deleteOtp(email: string):Promise<any>
}