import { Role } from "../../../shared/enums/role.enum"
import { UserResponseDTO } from "../../user/dto/user.response.dto"

export interface IAuthService {
    register(data: {
        name: string
        email: string
        password: string
        role: Role
    }): Promise<{ message: string }>

    login(data: {
        email: string
        password: string
    }): Promise<{ user: UserResponseDTO; accessToken: string; refreshToken: string }>

    sendOtp(email: string): Promise<void>

    verifyOtp(
        email: string,
        otp: string
    ): Promise<{ message: string }>

    resetPassword(
        email: string,
        otp: string,
        newPassword: string
    ): Promise<{ message: string }>

    refreshToken(token: string): Promise<{accessToken: string}> 

}