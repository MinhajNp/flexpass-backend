import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { TYPES } from "../../../core/container/types"
import { IAdminService } from "../interfaces/IAdminService"
import { asyncHandler } from "../../../shared/utils/asyncHandler"
import { sendResponse } from "../../../shared/utils/response"
import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { AdminMessages } from "../../../shared/constants/messages/admin.messages"
import { mapUserToAdminResponseDTO } from "../mappers/admin.mapper"

@injectable()
export class AdminController {

  constructor(
    @inject(TYPES.IAdminService)
    private adminService: IAdminService
  ) {}

  // ---------------------------
  // Gym Management: Stats
  // ---------------------------
  getGymManagementStats = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.adminService.getGymManagementStats();
    sendResponse(res, HttpStatus.OK, AdminMessages.GYM_STATS_FETCHED, result);
  })

  // ---------------------------
  // Gym Management: List Gyms
  // ---------------------------
  getPartnerGyms = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { gyms, totalCount } = await this.adminService.getPartnerGyms(page, limit);
    sendResponse(res, HttpStatus.OK, AdminMessages.PARTNER_GYMS_FETCHED, { data: gyms, totalCount, currentPage: page });
  })

  // ---------------------------
  // Gym Management: Update Status
  // ---------------------------
  updateGymStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { action } = req.body;
    await this.adminService.updateGymStatus(id, action);
    sendResponse(res, HttpStatus.OK, AdminMessages.GYM_STATUS_UPDATED);
  })

  // ---------------------------
  // Dashboard Stats
  // ---------------------------
  getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
    const result = await this.adminService.getDashboardStats();
    sendResponse(res, HttpStatus.OK, AdminMessages.DASHBOARD_STATS_FETCHED, result);
  })

  // ---------------------------
  // Get all users
  // ---------------------------
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { users, totalCount } = await this.adminService.getAllUsers(page, limit);

    const mappedUsers = users.map(mapUserToAdminResponseDTO);

    sendResponse(res, HttpStatus.OK, AdminMessages.USERS_FETCHED, { data: mappedUsers, totalCount, currentPage: page });
  })

  // ---------------------------
  // Toggle user status
  // ---------------------------
  toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { action } = req.body;

    const user = action === 'suspend'
      ? await this.adminService.blockUser(id)
      : await this.adminService.unblockUser(id);

    const mappedUser = mapUserToAdminResponseDTO(user);

    sendResponse(res, HttpStatus.OK, AdminMessages.USER_STATUS_UPDATED, mappedUser);
  })

}