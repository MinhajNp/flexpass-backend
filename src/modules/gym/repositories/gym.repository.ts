import { injectable } from "inversify"

import { Gym, IGym } from "../entities/gym.entity"
import { GymStatus } from "../../../shared/enums/gymStatus.enum"
import { IGymRepository } from "../interfaces/IGymRepository"

@injectable()
export class GymRepository implements IGymRepository {

  // -----------------------------------------
  // Create Gym
  // -----------------------------------------
  async createGym(data: Partial<IGym>): Promise<IGym> {
    const gym = await Gym.create(data)
    return gym.toObject()
  }

  // -----------------------------------------
  // Find by ID
  // -----------------------------------------
  async findById(id: string): Promise<IGym | null> {
    return Gym.findById(id).lean()
  }

  // -----------------------------------------
  // Find by Email
  // -----------------------------------------
  async findByEmail(email: string): Promise<IGym | null> {
    return Gym.findOne({ email }).lean()
  }

  // -----------------------------------------
  // Find Pending Gyms
  // -----------------------------------------
  async findPendingGyms(): Promise<IGym[]> {
    return Gym.find({ status: GymStatus.PENDING }).lean()
  }

  // -----------------------------------------
  // Find Approved Gyms
  // -----------------------------------------
  async findApprovedGyms(): Promise<IGym[]> {
    return Gym.find({ status: GymStatus.APPROVED }).lean()
  }

  // -----------------------------------------
  // Update Gym
  // -----------------------------------------
  async updateGym(id: string, data: Partial<IGym>): Promise<IGym | null> {
    return Gym.findByIdAndUpdate(id, data, { new: true }).lean()
  }

  // -----------------------------------------
  // Find by Invitation Token
  // -----------------------------------------
  async findByInvitationToken(token: string): Promise<IGym | null> {
    return Gym.findOne({ invitationToken: token }).lean()
  }

  // -----------------------------------------
  // Clear Invitation Token
  // -----------------------------------------
  async clearInvitationToken(gymId: string): Promise<void> {
    await Gym.findByIdAndUpdate(gymId, {
      invitationToken: null,
      invitationTokenExpiresAt: null
    })
  }

}