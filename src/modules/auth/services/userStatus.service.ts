import { inject, injectable } from "inversify"
import { IUserStatusService } from "../interfaces/IUserStatusService"
import { IUserRepository } from "../../user/interfaces/IUserRepository"
import { TYPES } from "../../../core/container/types"
import { UserStatus } from "../../../shared/enums/userStatus.enum"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { AppError } from "../../../shared/utils/AppError"
import { AuthMessages } from "../../../shared/constants/messages/auth.messages"

@injectable()
export class UserStatusService implements IUserStatusService {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}

  async checkIfBlocked(userId: string, errorCode: number): Promise<void> {
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new AppError(AuthMessages.USER_NOT_FOUND, HttpStatus.UNAUTHORIZED);
    }

    if (this.isStatusBlocked(user.status)) {
      throw new AppError(AuthMessages.USER_BLOCKED, errorCode);
    }
  }

  isStatusBlocked(status: UserStatus): boolean {
    return status === UserStatus.BLOCKED;
  }
}
