import { Gym, IGym } from "./gym.entity"
import { GymStatus } from "../../enums/gymStatus.enum"
import { IGymRepository } from "../../interfaces/IGymRepository"
import { injectable } from "inversify"

@injectable()
export class GymRepository implements IGymRepository {

  async createGym(data: Partial<IGym>): Promise<IGym> {
    const gym = new Gym(data)
    return gym.save()
  }

  async findById(id: string): Promise<IGym | null> {
    return Gym.findById(id)
  }

  async findPendingGyms(): Promise<IGym[]> {
    return Gym.find({ status: GymStatus.PENDING })
  }

   async findApprovedGyms(): Promise<IGym[]> {
    return Gym.find({ status: GymStatus.APPROVED })
  }

  async updateGym(id: string, data: Partial<IGym>): Promise<IGym | null> {
    return Gym.findByIdAndUpdate(id, data, { new: true })
  }

 

}