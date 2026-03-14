import { IGym } from "../modules/gym/gym.entity"

export interface IGymRepository {
  createGym(data: Partial<IGym>): Promise<IGym>
  findById(id: string): Promise<IGym | null>
  findPendingGyms(): Promise<IGym[]>
  findApprovedGyms(): Promise<IGym[]>
  updateGym(id: string, data: Partial<IGym>): Promise<IGym | null>
}