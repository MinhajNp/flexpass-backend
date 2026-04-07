import { UserStatus } from "../../../shared/enums/userStatus.enum"

export interface IUserStatusService {
  /**
   * Checks if a user is blocked and throws an AppError if they are.
   * @param userId The ID of the user to check
   * @param errorCode The HTTP status code to return (e.g. 401 or 403)
   */
  checkIfBlocked(userId: string, errorCode: number): Promise<void>;
  
  /**
   * Helper to determine if a status string represents a blocked user.
   */
  isStatusBlocked(status: UserStatus): boolean;
}
