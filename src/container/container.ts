import { Container } from "inversify"
import { TYPES } from "./types"

import { IUserRepository } from "../interfaces/IUserRepository"
import { IGymRepository } from "../interfaces/IGymRepository"
import { IOtpRepository } from "../interfaces/IOtpRepository"

import { IAuthService } from "../interfaces/services/IAuthService"
import { IGymService } from "../interfaces/services/IGymService"
import { IAdminService } from "../interfaces/services/IAdminService"

import { UserRepository } from "../modules/user/user.repository"
import { GymRepository } from "../modules/gym/gym.repository"
import { OtpRepository } from "../modules/auth/otp.repository"

import { AuthService } from "../modules/auth/auth.service"
import { GymService } from "../modules/gym/gym.service"
import { AdminService } from "../modules/admin/admin.service"

import { AuthController } from "../modules/auth/auth.controller"
import { GymController } from "../modules/gym/gym.controller"
import { AdminController } from "../modules/admin/admin.controller"
import { IOtpEmailService } from "../modules/auth/email/IOtpEmailService"
import { OtpEmailService } from "../modules/auth/email/otpEmail.service"

const container = new Container()

// repositories

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository)
container.bind<IGymRepository>(TYPES.IGymRepository).to(GymRepository)
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository)


// services

container.bind<IAuthService>(TYPES.IAuthService).to(AuthService)
container.bind<IGymService>(TYPES.IGymService).to(GymService)
container.bind<IAdminService>(TYPES.IAdminService).to(AdminService)
container.bind<IOtpEmailService>(TYPES.IOtpEmailService).to(OtpEmailService)


// controllers

container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<GymController>(TYPES.GymController).to(GymController)
container.bind<AdminController>(TYPES.AdminController).to(AdminController)

export default container