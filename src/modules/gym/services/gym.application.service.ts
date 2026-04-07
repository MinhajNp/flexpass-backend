import bcrypt from "bcrypt"
import crypto from "crypto"
import { inject, injectable } from "inversify"

import { IGymApplicationService } from "../interfaces/IGymApplicationService"
import { env } from "../../../core/config/env"
import { IGymRepository } from "../interfaces/IGymRepository"
import { IRegistrationTokenRepository } from "../interfaces/IRegistrationTokenRepository"
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
import { GymMessages } from "../../../shared/constants/messages/gym.messages"
import { SALT_ROUNDS, INVITATION_TOKEN_EXPIRY } from "../../../shared/constants/auth.constants"

@injectable()
export class GymApplicationService implements IGymApplicationService {

  constructor(
    @inject(TYPES.IGymRepository)
    private gymRepository: IGymRepository,

    @inject(TYPES.IRegistrationTokenRepository)
    private tokenRepository: IRegistrationTokenRepository,

    @inject(TYPES.IGymInvitationEmailService)
    private invitationEmailService: IGymInvitationEmailService,

    @inject(TYPES.IUserService)
    private userService: IUserService
  ) {}

  // -----------------------------------------
  // Apply Gym
  // -----------------------------------------
  async applyGym(data: ApplyGymDTO): Promise<GymResponseDTO> {
    const existingGym = await this.gymRepository.findByEmail(data.officialEmail)

    if (existingGym) {
      const currentStatus = existingGym.status as any;

      if (currentStatus === GymStatus.PENDING) {
        throw new AppError(GymMessages.ALREADY_PENDING(GymStatus.PENDING), HttpStatus.BAD_REQUEST)
      }
      
      if (currentStatus === GymStatus.APPROVED || currentStatus === GymStatus.SUSPENDED) {
        throw new AppError(GymMessages.ALREADY_EXISTS(currentStatus.toLowerCase()), HttpStatus.BAD_REQUEST)
      }

      // If status is REJECTED (or any legacy status like UNDER_REVIEW), allow re-application
      const updatedGym = await this.gymRepository.updateGym(
        existingGym._id.toString(),
        {
          ...data,
          documents: data.documents.map(doc => ({ ...doc, status: 'PENDING' as const })),
          status: GymStatus.PENDING,
          rejectionReason: undefined
        }
      )
      
      if (!updatedGym) throw new AppError(GymMessages.REAPPLY_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
      return mapGymToResponseDTO(updatedGym)
    }

    const gym = await this.gymRepository.createGym({
      ...data,
      documents: data.documents.map(doc => ({ ...doc, status: 'PENDING' as const })),
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
      throw new AppError(GymMessages.REAPPLY_NOT_ALLOWED, HttpStatus.BAD_REQUEST)
    }
    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.PENDING,
      rejectionReason: ""
    })
    if (!updatedGym) throw new AppError(GymMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
    return mapGymToResponseDTO(updatedGym)
  }

  // -----------------------------------------
  // Admin Actions
  // -----------------------------------------
  async getPendingGyms(): Promise<GymResponseDTO[]> {
    const gyms = await this.gymRepository.findPendingGyms()
    return gyms.map(mapGymToResponseDTO)
  }

  async getApprovedGyms(): Promise<GymResponseDTO[]> {
    const gyms = await this.gymRepository.findApprovedGyms()
    return gyms.map(mapGymToResponseDTO)
  }

  async getApplications(page?: number, limit?: number): Promise<{ applications: GymResponseDTO[]; totalCount: number }> {
    const { applications, totalCount } = await this.gymRepository.findApplications(page, limit)
    return {
      applications: applications.map(mapGymToResponseDTO),
      totalCount
    }
  }

  async getApplicationById(id: string): Promise<GymResponseDTO | null> {
    const gym = await this.gymRepository.findById(id)
    if (!gym) return null
    return mapGymToResponseDTO(gym)
  }

  async approveGym(id: string, category: string): Promise<GymResponseDTO> {
    const gym = await this.getGymOrThrow(id)
    
    // Support legacy 'UNDER_REVIEW' status string for a smooth transition
    const currentStatus = gym.status as any;
    if (currentStatus !== GymStatus.PENDING && currentStatus !== 'UNDER_REVIEW') {
      throw new AppError(GymMessages.INVALID_APPROVAL_STATE, HttpStatus.BAD_REQUEST)
    }

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.APPROVED,
      category: category as any
    })

    if (!updatedGym) throw new AppError(GymMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)

    const registrationLink = await this.generateRegistrationLink(id)
    const token = registrationLink.split("token=")[1]
    
    await this.invitationEmailService.sendInvitation(updatedGym.officialEmail, token)

    return mapGymToResponseDTO(updatedGym)
  }

  async rejectGym(id: string, reason: string): Promise<GymResponseDTO> {
    const gym = await this.getGymOrThrow(id)
    
    // Support legacy 'UNDER_REVIEW' status string for a smooth transition
    const currentStatus = gym.status as any;
    if (currentStatus !== GymStatus.PENDING && currentStatus !== 'UNDER_REVIEW') {
      throw new AppError(GymMessages.INVALID_REJECTION_STATE, HttpStatus.BAD_REQUEST)
    }

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.REJECTED,
      rejectionReason: reason
    })

    if (!updatedGym) throw new AppError(GymMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)

    // Notify user via email
    await this.invitationEmailService.sendRejection(updatedGym.officialEmail, reason)

    return mapGymToResponseDTO(updatedGym)
  }

  async updateApplicationStatus(id: string, data: Partial<any>): Promise<GymResponseDTO> {
    const updatedGym = await this.gymRepository.updateGym(id, data)
    if (!updatedGym) throw new AppError(GymMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR)
    return mapGymToResponseDTO(updatedGym)
  }

  // -----------------------------------------
  // Registration Flow
  // -----------------------------------------
  async generateRegistrationLink(gymId: string): Promise<string> {
    const token = crypto.randomBytes(32).toString("hex")
    const expiresAt = new Date(Date.now() + INVITATION_TOKEN_EXPIRY)

    await this.tokenRepository.createToken({
      gymId: gymId as any,
      token,
      isUsed: false,
      expiresAt
    })

    return `${env.CLIENT_URL}/complete-registration?token=${token}`
  }

  async validateRegistrationToken(token: string): Promise<{ gymId: string, email: string, gymName: string }> {
    const registrationToken = await this.tokenRepository.findByToken(token)

    if (!registrationToken) {
      throw new AppError(GymMessages.INVALID_TOKEN, HttpStatus.BAD_REQUEST)
    }

    if (registrationToken.expiresAt < new Date()) {
      throw new AppError(GymMessages.TOKEN_EXPIRED, HttpStatus.BAD_REQUEST)
    }

    const gym = await this.gymRepository.findById(registrationToken.gymId.toString())
    if (!gym) {
      throw new AppError(GymMessages.GYM_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    return { 
      gymId: gym._id.toString(), 
      email: gym.officialEmail, 
      gymName: gym.gymName 
    }
  }

  async completeRegistration(data: CompleteRegistrationDTO): Promise<void> {
    const { token, password, adminFullName, adminContactNumber } = data

    const registrationToken = await this.tokenRepository.findByToken(token)
    if (!registrationToken || registrationToken.expiresAt < new Date()) {
      throw new AppError(GymMessages.INVALID_TOKEN, HttpStatus.BAD_REQUEST)
    }

    const gym = await this.gymRepository.findById(registrationToken.gymId.toString())
    if (!gym) throw new AppError(GymMessages.GYM_NOT_FOUND, HttpStatus.NOT_FOUND)

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Update Gym Details
    await this.gymRepository.updateGym(gym._id.toString(), {
      adminFullName,
      adminContactNumber,
      status: GymStatus.APPROVED
    })

    // Create Gym Admin User
    await this.userService.createOrUpdateGymAdmin({
      email: gym.officialEmail,
      password: hashedPassword,
      name: adminFullName,
      role: Role.GYM_ADMIN,
      status: UserStatus.ACTIVE
    })

    // Mark token as used
    await this.tokenRepository.markAsUsed(registrationToken._id.toString())
  }

  // -----------------------------------------
  // Helpers
  // -----------------------------------------
  private async getGymOrThrow(id: string) {
    const gym = await this.gymRepository.findById(id)
    if (!gym) throw new AppError(GymMessages.GYM_NOT_FOUND, HttpStatus.NOT_FOUND)
    return gym
  }
}
