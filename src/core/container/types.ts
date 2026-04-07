export const TYPES = {

  // Repositories
  IUserRepository: Symbol.for("IUserRepository"),
  IGymRepository: Symbol.for("IGymRepository"),
  IOtpRepository: Symbol.for("IOtpRepository"),
  IRegistrationTokenRepository: Symbol.for("IRegistrationTokenRepository"),

  // Services
  IAuthService: Symbol.for("IAuthService"),
  IUserService: Symbol.for("IUserService"),
  IGymApplicationService: Symbol.for("IGymApplicationService"),
  IAdminService: Symbol.for("IAdminService"),
  IOtpEmailService: Symbol.for("IOtpEmailService"),
  IGymInvitationEmailService: Symbol.for("IGymInvitationEmailService"),
  IOtpService: Symbol.for("IOtpService"),
  ITokenService: Symbol.for("ITokenService"),
  IGymAdminService: Symbol.for("IGymAdminService"),
  IGoogleAuthService: Symbol.for("IGoogleAuthService"),
  IRoleService: Symbol.for("IRoleService"),
  IUserStatusService: Symbol.for("IUserStatusService"),

  // Controllers
  AuthController: Symbol.for("AuthController"),
  UserController: Symbol.for("UserController"),
  GymController: Symbol.for("GymController"),
  AdminController: Symbol.for("AdminController"),
  GymAdminController: Symbol.for("GymAdminController"),
};