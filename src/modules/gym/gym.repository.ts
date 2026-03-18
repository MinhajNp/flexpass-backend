import { injectable } from "inversify"

import { Gym, IGym } from "./gym.entity"
import { GymStatus } from "../../shared/enums/gymStatus.enum"
import { IGymRepository } from "./interfaces/IGymRepository"

@injectable()
export class GymRepository implements IGymRepository {

  // Insert a new gym document
  async createGym(data: Partial<IGym>): Promise<IGym> {
    return Gym.create(data)
  }

  // Get gym by MongoDB _id
  async findById(id: string): Promise<IGym | null> {
    return Gym.findById(id).lean()
  }

  // Get gyms waiting for admin approval
  async findPendingGyms(): Promise<IGym[]> {
    return Gym.find({ status: GymStatus.PENDING }).lean()
  }

  // Get gyms approved by admin
  async findApprovedGyms(): Promise<IGym[]> {
    return Gym.find({ status: GymStatus.APPROVED }).lean()
  }

  // Update gym details and return updated document
  async updateGym(id: string, data: Partial<IGym>): Promise<IGym | null> {
    return Gym.findByIdAndUpdate(id, data, { new: true }).lean()
  }

}