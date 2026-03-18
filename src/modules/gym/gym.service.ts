import { GymRepository } from "./gym.repository"
import { ApplyGymDTO } from "./dto/applyGym.dto"
import { GymResponseDTO } from "./dto/gym.response.dto"
import { mapGymToResponseDTO } from "./mappers/gym.mapper"
import { GymStatus } from "../../enums/gymStatus.enum"
import { AppError } from "../../utils/AppError"

export class GymService {

  private gymRepository = new GymRepository()

  // --------------------------------------------------
  // Gym Apply
  // --------------------------------------------------

  async applyGym(data: ApplyGymDTO): Promise<GymResponseDTO> {

    const gym = await this.gymRepository.createGym({
      ...data,
      status: GymStatus.PENDING
    })

    return mapGymToResponseDTO(gym)
  }

  // --------------------------------------------------
  // Get Pending Gyms (Admin)
  // --------------------------------------------------

  async getPendingGyms(): Promise<GymResponseDTO[]> {

    const gyms = await this.gymRepository.findPendingGyms()

    return gyms.map(mapGymToResponseDTO)
  }

  // --------------------------------------------------
  // Approve Gym (Admin)
  // --------------------------------------------------

  async approveGym(id: string): Promise<GymResponseDTO> {

    const gym = await this.gymRepository.findById(id)

    if (!gym) {
      throw new AppError("Gym not found", 404)
    }

    if (gym.status !== GymStatus.PENDING) {
      throw new AppError("Gym is not pending approval", 400)
    }

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.APPROVED
    })

    return mapGymToResponseDTO(updatedGym!)
  }

  // --------------------------------------------------
  // Reject Gym (Admin)
  // --------------------------------------------------

  async rejectGym(id: string, reason: string): Promise<GymResponseDTO> {

    const gym = await this.gymRepository.findById(id)

    if (!gym) {
      throw new AppError("Gym not found", 404)
    }

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.REJECTED,
      rejectionReason: reason
    })

    return mapGymToResponseDTO(updatedGym!)
  }

  // --------------------------------------------------
  // Reapply Gym
  // --------------------------------------------------

  async reapplyGym(id: string): Promise<GymResponseDTO> {

    const gym = await this.gymRepository.findById(id)

    if (!gym) {
      throw new AppError("Gym not found", 404)
    }

    if (gym.status !== GymStatus.REJECTED) {
      throw new AppError("Only rejected gyms can reapply", 400)
    }

    const updatedGym = await this.gymRepository.updateGym(id, {
      status: GymStatus.PENDING,
      rejectionReason: ""
    })

    return mapGymToResponseDTO(updatedGym!)
  }

}