import { Container } from "inversify"

import { IUserRepository } from "../interfaces/IUserRepository"
import { IGymRepository } from "../interfaces/IGymRepository"
import { IOtpRepository } from "../interfaces/IOtpRepository"

import { UserRepository } from "../modules/user/user.repository"
import { GymRepository } from "../modules/gym/gym.repository"
import { OtpRepository } from "../modules/auth/otp.repository"

import { AuthService } from "../modules/auth/auth.service"
import { GymService } from "../modules/gym/gym.service"
import { TYPES } from "../types/type"
import { AdminController } from "../modules/admin/admin.controller"
import { AuthController } from "../modules/auth/auth.controller"
import { IAuthService } from "../interfaces/services/auth.service.interface"
import { IGymService } from "../interfaces/services/gym.service.interface"
import { GymController } from "../modules/gym/gym.controller"
import { IAdminService } from "../interfaces/services/admin.service.interface"
import { AdminService } from "../modules/admin/admin.service"


const container = new Container()

// repositories
container.bind<IUserRepository>(TYPES.IUserRepository).to(UserRepository)
container.bind<IGymRepository>(TYPES.IGymRepository).to(GymRepository)
container.bind<IOtpRepository>(TYPES.IOtpRepository).to(OtpRepository)

// services
container.bind<IAuthService>(TYPES.IAuthService).to(AuthService)
container.bind<IGymService>(TYPES.IGymService).to(GymService)
container.bind<IAdminService>(TYPES.IAdminService).to(AdminService)
// controllers
container.bind<AdminController>(TYPES.AdminController).to(AdminController);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);
container.bind<GymController>(TYPES.GymController).to(GymController);

export { container }