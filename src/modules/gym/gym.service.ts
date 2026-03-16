import bcrypt from "bcrypt"
import { ApplyGymDTO } from "./dto/apply.gym.dto"
import { GymResponseDTO } from "./dto/gym.response.dto"
import { mapGymToResponseDTO } from "./mappers/gym.mapper"

import { GymStatus } from "../../shared/enums/gymStatus.enum"
import { HttpStatus } from "../../shared/enums/httpStatus.enum"
import { AppError } from "../../shared/utils/AppError"

import { IGymService } from "./interfaces/IGymService"
import { IGymRepository } from "./interfaces/IGymRepository"

import { inject, injectable } from "inversify"
import { TYPES } from "../../core/container/types"
import { IGymInvitationEmailService } from "./email/IGymInvitationEmailService"

import { generateToken } from "../../shared/utils/token.util"
import { INVITATION_TOKEN_EXPIRY } from "../../shared/constants/auth.constants"
import { IUserRepository } from "../user/interfaces/IUserRepository"
import { CompleteRegistrationDTO } from "./dto/complete-registration.dto"
import { Role } from "../../shared/enums/role.enum"
import { UserStatus } from "../../shared/enums/userStatus.enum"

@injectable()
export class GymService implements IGymService {

  constructor(
  @inject(TYPES.IGymRepository)
  private gymRepository: IGymRepository,

  @inject(TYPES.IGymInvitationEmailService)
  private invitationEmailService: IGymInvitationEmailService,

  @inject(TYPES.IUserRepository)
  private userRepository: IUserRepository
) {}

  async applyGym(data: ApplyGymDTO): Promise<GymResponseDTO> {

  const existingGym = await this.gymRepository.findByEmail(data.email)

  if (existingGym) {

    if (existingGym.status === GymStatus.PENDING) {
      throw new AppError("Gym application already under review", HttpStatus.BAD_REQUEST)
    }

    if (existingGym.status === GymStatus.APPROVED) {
      throw new AppError("Gym already approved with this email", HttpStatus.BAD_REQUEST)
    }

    if (existingGym.status === GymStatus.REJECTED) {

      const updatedGym = await this.gymRepository.updateGym(
        existingGym._id.toString(),
        {
          ...data,
          status: GymStatus.PENDING,
          rejectionReason: undefined
        }
      )

      if (!updatedGym) {
        throw new AppError("Failed to reapply gym", HttpStatus.INTERNAL_SERVER_ERROR)
      }

      return mapGymToResponseDTO(updatedGym)
    }
  }

  const existingUser = await this.userRepository.findByEmail(data.email)

  if (existingUser) {
    throw new AppError("A user account already exists with this email", HttpStatus.BAD_REQUEST)
  }

  const gym = await this.gymRepository.createGym({
    ...data,
    status: GymStatus.PENDING
  })

  return mapGymToResponseDTO(gym)
}

  async getPendingGyms(): Promise<GymResponseDTO[]> {

    const gyms = await this.gymRepository.findPendingGyms()

    return gyms.map(mapGymToResponseDTO)
  }

  async getApprovedGyms(): Promise<GymResponseDTO[]> {

    const gyms = await this.gymRepository.findApprovedGyms()

    return gyms.map(mapGymToResponseDTO)
  }

  async approveGym(id: string): Promise<GymResponseDTO> {

  const gym = await this.gymRepository.findById(id)

  if (!gym) {
    throw new AppError("Gym not found", HttpStatus.NOT_FOUND)
  }

  if (gym.status !== GymStatus.PENDING) {
    throw new AppError("Gym is not pending approval", HttpStatus.BAD_REQUEST)
  }

  const token = generateToken()

  const updatedGym = await this.gymRepository.updateGym(id, {
    status: GymStatus.APPROVED,
    invitationToken: token,
    invitationTokenExpiresAt: new Date(Date.now() + INVITATION_TOKEN_EXPIRY)
  })

  if (!updatedGym) {
    throw new AppError("Gym update failed", HttpStatus.INTERNAL_SERVER_ERROR)
  }

  await this.invitationEmailService.sendInvitation(updatedGym.email, token)

  return mapGymToResponseDTO(updatedGym)
}

  async rejectGym(id: string, reason: string): Promise<GymResponseDTO> {

    const gym = await this.gymRepository.findById(id)

    if (!gym) {
      throw new AppError("Gym not found", HttpStatus.NOT_FOUND)
    }

    if (gym.status !== GymStatus.PENDING) {
      throw new AppError("Only pending gyms can be rejected", HttpStatus.BAD_REQUEST)
    }

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.REJECTED,
      rejectionReason: reason
    })

    if (!updatedGym) {
      throw new AppError("Gym update failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return mapGymToResponseDTO(updatedGym)
  }

  async reapplyGym(id: string): Promise<GymResponseDTO> {

    const gym = await this.gymRepository.findById(id)

    if (!gym) {
      throw new AppError("Gym not found", HttpStatus.NOT_FOUND)
    }

    if (gym.status !== GymStatus.REJECTED) {
      throw new AppError("Only rejected gyms can reapply", HttpStatus.BAD_REQUEST)
    }

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.PENDING,
      rejectionReason: ""
    })

    if (!updatedGym) {
      throw new AppError("Gym update failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return mapGymToResponseDTO(updatedGym)
  }

  async validateInvitation(token: string) {

  const gym = await this.gymRepository.findByInvitationToken(token)

  if (!gym) {
    throw new AppError("Invalid invitation link", HttpStatus.BAD_REQUEST)
  }

  if (!gym.invitationTokenExpiresAt) {
    throw new AppError("Invalid invitation link", HttpStatus.BAD_REQUEST)
  }

  if (gym.invitationTokenExpiresAt < new Date()) {
    throw new AppError("Invitation link expired", HttpStatus.BAD_REQUEST)
  }

  return {
    email: gym.email
  }
}

  async completeRegistration(data: CompleteRegistrationDTO): Promise<void> {

  const { token, name, password } = data

  const gym = await this.gymRepository.findByInvitationToken(token)

  if (!gym) {
    throw new AppError("Invalid invitation link", HttpStatus.BAD_REQUEST)
  }

  if (!gym.invitationTokenExpiresAt) {
    throw new AppError("Invalid invitation link", HttpStatus.BAD_REQUEST)
  }

  if (gym.invitationTokenExpiresAt < new Date()) {
    throw new AppError("Invitation link expired", HttpStatus.BAD_REQUEST)
  }

  const existingUser = await this.userRepository.findByEmail(gym.email)

  const hashedPassword = await bcrypt.hash(password, 10)

  if (existingUser) {

    await this.userRepository.updateUser(existingUser._id.toString(), {
      password: hashedPassword,
      role: Role.GYM_ADMIN
    })

  } else {

    await this.userRepository.createUser({
      name: gym.name,
      email: gym.email,
      password: hashedPassword,
      role: Role.GYM_ADMIN,
      status: UserStatus.ACTIVE
    })

  }

  await this.gymRepository.clearInvitationToken(gym._id.toString())
}

}