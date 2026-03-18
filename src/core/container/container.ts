import { Container } from "inversify"
import { TYPES } from "./types"

import { IUserRepository } from "../../modules/user/interfaces/IUserRepository"
import { IGymRepository } from "../../modules/gym/interfaces/IGymRepository"
import { IOtpRepository } from "../../modules/auth/otp/IOtpRepository"

import { IAuthService } from "../../modules/auth/interfaces/IAuthService"
import { IGymService } from "../../modules/gym/interfaces/IGymService"
import { IAdminService } from "../../modules/admin/interfaces/IAdminService"

import { UserRepository } from "../../modules/user/user.repository"
import { GymRepository } from "../../modules/gym/gym.repository"
import { OtpRepository } from "../../modules/auth/otp/otp.repository"

import { AuthService } from "../../modules/auth/auth.service"
import { GymService } from "../../modules/gym/gym.service"
import { AdminService } from "../../modules/admin/admin.service"

import { AuthController } from "../../modules/auth/auth.controller"
import { GymController } from "../../modules/gym/gym.controller"
import { AdminController } from "../../modules/admin/admin.controller"
import { IOtpEmailService } from "../../modules/auth/email/IOtpEmailService"
import { OtpEmailService } from "../../modules/auth/email/otpEmail.service"
import { IGymInvitationEmailService } from "../../modules/gym/email/IGymInvitationEmailService"
import { GymInvitationEmailService } from "../../modules/gym/email/gymInvitationEmail.service"

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
container.bind<IGymInvitationEmailService>(TYPES.IGymInvitationEmailService)
.to(GymInvitationEmailService)


// controllers

container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<GymController>(TYPES.GymController).to(GymController)
container.bind<AdminController>(TYPES.AdminController).to(AdminController)

export default container