import { ApplyGymDTO } from "../dto/apply.gym.dto";
import { GymResponseDTO } from "../dto/gym.response.dto";

export interface IGymService{
    applyGym(data: ApplyGymDTO): Promise<GymResponseDTO>
    getPendingGyms(): Promise<GymResponseDTO[]>
    getApprovedGyms(): Promise<GymResponseDTO[]>
    approveGym(id: string): Promise<GymResponseDTO>
    rejectGym(id: string, reason: string): Promise<GymResponseDTO>
    reapplyGym(id: string): Promise<GymResponseDTO>
}