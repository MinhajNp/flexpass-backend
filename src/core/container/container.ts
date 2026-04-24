import { Container } from "inversify"
import { TYPES } from "./types"

import { IUserRepository } from "../../modules/user/interfaces/IUserRepository"
import { IGymRepository } from "../../modules/gym/interfaces/IGymRepository"
import { IOtpRepository } from "../../modules/auth/interfaces/IOtpRepository"
import { IRegistrationTokenRepository } from "../../modules/gym/interfaces/IRegistrationTokenRepository"
import { ICheckInRepository } from "../../modules/gym/interfaces/ICheckInRepository"

import { IAuthService } from "../../modules/auth/interfaces/IAuthService"
import { IGymApplicationService } from "../../modules/gym/interfaces/IGymApplicationService"
import { IAdminService } from "../../modules/admin/interfaces/IAdminService"

import { UserRepository } from "../../modules/user/repositories/user.repository"
import { GymRepository } from "../../modules/gym/repositories/gym.repository"
import { OtpRepository } from "../../modules/auth/repositories/otp.repository"
import { RegistrationTokenRepository } from "../../modules/gym/repositories/registrationToken.repository"
import { CheckInRepository } from "../../modules/gym/repositories/checkin.repository"

import { AuthService } from "../../modules/auth/services/auth.service"
import { GymApplicationService } from "../../modules/gym/services/gym.application.service"
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

import { IGymAdminService } from "../../modules/gym/interfaces/IGymAdminService"
import { GymAdminService } from "../../modules/gym/services/gymAdmin.service"
import { GymAdminController } from "../../modules/gym/controllers/gymAdmin.controller"
import { IGoogleAuthService } from "../../modules/auth/interfaces/IGoogleAuthService"
import { GoogleAuthService } from "../../modules/auth/external/GoogleAuthService"
import { IRoleService } from "../../modules/auth/interfaces/IRoleService"
import { RoleService } from "../../modules/auth/services/role.service"
import { IUserStatusService } from "../../modules/auth/interfaces/IUserStatusService"
import { UserStatusService } from "../../modules/auth/services/userStatus.service"

const container = new Container()

// repositories

container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository)
container.bind<IGymRepository>(TYPES.IGymRepository).to(GymRepository)
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository)
container.bind<IRegistrationTokenRepository>(TYPES.IRegistrationTokenRepository).to(RegistrationTokenRepository)
container.bind<ICheckInRepository>(TYPES.ICheckInRepository).to(CheckInRepository)


// services

container.bind<IAuthService>(TYPES.IAuthService).to(AuthService)
container.bind<IGymApplicationService>(TYPES.IGymApplicationService).to(GymApplicationService)
container.bind<IAdminService>(TYPES.IAdminService).to(AdminService)
container.bind<IOtpEmailService>(TYPES.IOtpEmailService).to(OtpEmailService)
container.bind<IGymInvitationEmailService>(TYPES.IGymInvitationEmailService)
.to(GymInvitationEmailService)
container.bind<IUserService>(TYPES.IUserService).to(UserService)
container.bind<IOtpService>(TYPES.IOtpService).to(OtpService)
container.bind<ITokenService>(TYPES.ITokenService)
  .to(TokenService)
  .inSingletonScope()
container.bind<IGymAdminService>(TYPES.IGymAdminService).to(GymAdminService)
container.bind<IGoogleAuthService>(TYPES.IGoogleAuthService).to(GoogleAuthService)
container.bind<IRoleService>(TYPES.IRoleService).to(RoleService)
container.bind<IUserStatusService>(TYPES.IUserStatusService).to(UserStatusService)


// controllers

container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<GymController>(TYPES.GymController).to(GymController)
container.bind<AdminController>(TYPES.AdminController).to(AdminController)
container.bind<GymAdminController>(TYPES.GymAdminController).to(GymAdminController)

export default container