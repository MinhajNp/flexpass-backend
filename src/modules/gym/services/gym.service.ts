import bcrypt from "bcrypt"
import { inject, injectable } from "inversify"

import { IGymService } from "../interfaces/IGymService"
import { IGymRepository } from "../interfaces/IGymRepository"
import { IGymInvitationEmailService } from "../interfaces/IGymInvitationEmailService"
import { IUserService } from "../../user/interfaces/IUserService"

import { TYPES } from "../../../core/container/types"

import { ApplyGymDTO } from "../dto/apply.gym.dto"
import { CompleteRegistrationDTO } from "../dto/complete-registration.dto"
import { GymResponseDTO } from "../dto/gym.response.dto"
import { mapGymToResponseDTO } from "../mappers/gym.mapper"

import { GymStatus } from "../../../shared/enums/gymStatus.enum"
import { Role } from "../../../shared/enums/role.enum"
import { UserStatus } from "../../../shared/enums/userStatus.enum"

import { AppError } from "../../../shared/utils/AppError"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"

import { generateToken } from "../../../shared/utils/token.util"
import { INVITATION_TOKEN_EXPIRY } from "../../../shared/constants/auth.constants"

const SALT_ROUNDS = 10

@injectable()
export class GymService implements IGymService {

  constructor(
    @inject(TYPES.IGymRepository)
    private gymRepository: IGymRepository,

    @inject(TYPES.IGymInvitationEmailService)
    private invitationEmailService: IGymInvitationEmailService,

    @inject(TYPES.IUserService)
    private userService: IUserService
  ) {}

  // -----------------------------------------
  // Apply Gym
  // -----------------------------------------
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

    const userExists = await this.userService.findUserByEmail(data.email)

    if (userExists) {
      throw new AppError("User already exists with this email", HttpStatus.BAD_REQUEST)
    }

    const gym = await this.gymRepository.createGym({
      ...data,
      status: GymStatus.PENDING
    })

    return mapGymToResponseDTO(gym)
  }

  // -----------------------------------------
  // Reapply Gym
  // -----------------------------------------
  async reapplyGym(id: string): Promise<GymResponseDTO> {

    const gym = await this.getGymOrThrow(id)

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

  // -----------------------------------------
  // Get Pending Gyms
  // -----------------------------------------
  async getPendingGyms(): Promise<GymResponseDTO[]> {

    const gyms = await this.gymRepository.findPendingGyms()

    return gyms.map(mapGymToResponseDTO)
  }

  // -----------------------------------------
  // Get Approved Gyms
  // -----------------------------------------
  async getApprovedGyms(): Promise<GymResponseDTO[]> {

    const gyms = await this.gymRepository.findApprovedGyms()

    return gyms.map(mapGymToResponseDTO)
  }

  // -----------------------------------------
  // Approve Gym
  // -----------------------------------------
  async approveGym(id: string): Promise<GymResponseDTO> {

    const gym = await this.getGymOrThrow(id)

    if (gym.status !== GymStatus.PENDING) {
      throw new AppError("Gym is not pending approval", HttpStatus.BAD_REQUEST)
    }

    const token = generateToken()

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.APPROVED,
      invitationToken: token,
      invitationTokenExpiresAt: this.getTokenExpiry()
    })

    if (!updatedGym) {
      throw new AppError("Gym update failed", HttpStatus.INTERNAL_SERVER_ERROR)
    }

    await this.invitationEmailService.sendInvitation(updatedGym.email, token)

    return mapGymToResponseDTO(updatedGym)
  }

  // -----------------------------------------
  // Reject Gym
  // -----------------------------------------
  async rejectGym(id: string, reason: string): Promise<GymResponseDTO> {

    const gym = await this.getGymOrThrow(id)

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

  // -----------------------------------------
  // Validate Invitation
  // -----------------------------------------
  async validateInvitation(token: string): Promise<{ email: string }> {

    const gym = await this.gymRepository.findByInvitationToken(token)

    this.validateInvitationOrThrow(gym)

    return { email: gym!.email }
  }

  // -----------------------------------------
  // Complete Registration
  // -----------------------------------------
  async completeRegistration(data: CompleteRegistrationDTO): Promise<void> {

    const { token, password } = data

    const gym = await this.gymRepository.findByInvitationToken(token)

    this.validateInvitationOrThrow(gym)

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    await this.userService.createOrUpdateGymAdmin({
      email: gym!.email,
      password: hashedPassword,
      name: gym!.name,
      role: Role.GYM_ADMIN,
      status: UserStatus.ACTIVE
    })

    await this.gymRepository.clearInvitationToken(gym!._id.toString())
  }

  // -----------------------------------------
  // Helpers
  // -----------------------------------------
  private async getGymOrThrow(id: string) {

    const gym = await this.gymRepository.findById(id)

    if (!gym) {
      throw new AppError("Gym not found", HttpStatus.NOT_FOUND)
    }

    return gym
  }

  private validateInvitationOrThrow(gym: any) {

    if (!gym || !gym.invitationTokenExpiresAt) {
      throw new AppError("Invalid invitation link", HttpStatus.BAD_REQUEST)
    }

    if (gym.invitationTokenExpiresAt < new Date()) {
      throw new AppError("Invitation link expired", HttpStatus.BAD_REQUEST)
    }
  }

  private getTokenExpiry(): Date {
    return new Date(Date.now() + INVITATION_TOKEN_EXPIRY)
  }
}