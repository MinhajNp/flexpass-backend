import { Container } from "inversify"
import { TYPES } from "./types"

import { IUserRepository } from "../../modules/user/interfaces/IUserRepository"
import { IGymRepository } from "../../modules/gym/interfaces/IGymRepository"
import { IOtpRepository } from "../../modules/auth/interfaces/IOtpRepository"

import { IAuthService } from "../../modules/auth/interfaces/IAuthService"
import { IGymService } from "../../modules/gym/interfaces/IGymService"
import { IAdminService } from "../../modules/admin/interfaces/IAdminService"

import { UserRepository } from "../../modules/user/repositories/user.repository"
import { GymRepository } from "../../modules/gym/repositories/gym.repository"
import { OtpRepository } from "../../modules/auth/repositories/otp.repository"

import { AuthService } from "../../modules/auth/services/auth.service"
import { GymService } from "../../modules/gym/services/gym.service"
import { AdminService } from "../../modules/admin/services/admin.service"

import { AuthController } from "../../modules/auth/controllers/auth.controller"
import { GymController } from "../../modules/gym/controllers/gym.controller"
import { AdminController } from "../../modules/admin/controllers/admin.controller"
import { IOtpEmailService } from "../../modules/auth/interfaces/IOtpEmailService"
import { OtpEmailService } from "../../modules/auth/external/otpEmail.service"
import { IGymInvitationEmailService } from "../../modules/gym/interfaces/IGymInvitationEmailService"
import { GymInvitationEmailService } from "../../modules/gym/external/gymInvitationEmail.service"
import { IUserService } from "../../modules/user/interfaces/IUserService"
import { UserService } from "../../modules/user/services/user.service"
import { IOtpService } from "../../modules/auth/interfaces/IOtpService"
import { OtpService } from "../../modules/auth/services/otp.service"
import { ITokenService } from "../../modules/auth/interfaces/ITokenService"
import { TokenService } from "../../modules/auth/services/token.service"

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
container.bind<IUserService>(TYPES.IUserService).to(UserService)
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService)
container.bind<ITokenService>(TYPES.ITokenService)
  .to(TokenService)
  .inSingletonScope()


// controllers

container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<GymController>(TYPES.GymController).to(GymController)
container.bind<AdminController>(TYPES.AdminController).to(AdminController)

export default container