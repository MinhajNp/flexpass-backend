import { Gym, IGym } from "./gym.entity"
import { GymStatus } from "../../enums/gymStatus.enum"

export class GymRepository {

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

  async updateGym(id: string, data: Partial<IGym>): Promise<IGym | null> {
    return Gym.findByIdAndUpdate(id, data, { new: true })
  }

}