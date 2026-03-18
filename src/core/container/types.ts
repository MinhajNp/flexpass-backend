export const TYPES = {

  // Repositories
  IUserRepository: Symbol.for("IUserRepository"),
  IGymRepository: Symbol.for("IGymRepository"),
  IOtpRepository: Symbol.for("IOtpRepository"),

  // Services
  IAuthService: Symbol.for("IAuthService"),
  IUserService: Symbol.for("IUserService"),
  IGymService: Symbol.for("IGymService"),
  IAdminService: Symbol.for("IAdminService"),
  IOtpEmailService: Symbol.for("IOtpEmailService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  UserController: Symbol.for("UserController"),
  GymController: Symbol.for("GymController"),
  AdminController: Symbol.for("AdminController"),
};