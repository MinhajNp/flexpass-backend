import { IUser } from "../../user/entities/user.entity";

export interface IRoleService {
  /**
   * Assigns a default role to a new user.
   */
  getDefaultRole(): string;

  /**
   * Checks if a user with GYM_ADMIN role has an approved gym.
   * If not, they should be redirected to the "Wait for Approval" page.
   */
  isGymAdminApproved(user: IUser): Promise<boolean>;

  /**
   * Gets the target redirection path based on user role and status.
   */
  getRedirectPath(user: IUser): Promise<string>;
}
