import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { TYPES } from "../../../core/container/types"

import { IAdminService } from "../interfaces/IAdminService"

import { asyncHandler } from "../../../shared/utils/asyncHandler"
import { sendResponse } from "../../../shared/utils/response"

import { HttpStatus } from "../../../shared/enums/httpStatus.enum"

import { User } from "../../user/entities/user.entity"
import { Gym } from "../../gym/entities/gym.entity"
import { CheckIn } from "../../gym/entities/checkin.entity"

@injectable()
export class AdminController {

  constructor(
    @inject(TYPES.IAdminService)
    private adminService: IAdminService
  ) {}

  // ---------------------------
  // Get dashboard stats
  // ---------------------------
  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    
    // Total Users (where role is 'USER')
    const totalUsers = await User.countDocuments({ role: 'USER' });

    // Active Gyms (where status is 'ACTIVE')
    const activeGyms = await Gym.countDocuments({ status: 'APPROVED' });

    // Today's Check-ins
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const todaysCheckins = await CheckIn.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const payload = {
      totalUsers,
      activeGyms,
      todaysCheckins,
      monthlyRevenue: 840000,
      pendingPayouts: 120000
    };

    sendResponse(res, HttpStatus.OK, "Dashboard stats fetched successfully", payload);

  })

  // ---------------------------
  // Get all users
  // ---------------------------
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {

    const users = await this.adminService.getAllUsers();
    
    // Map existing UserResponseDTO to match frontend AdminUser interface with actual DB subscription & stats
    const mappedUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      status: u.status === 'ACTIVE' ? 'Active' : (u.status === 'SUSPENDED' ? 'Suspended' : u.status),
      membershipPlan: u.active_membership?.plan || 'No Plan',
      expiryDate: u.active_membership?.expiryDate ? new Date(u.active_membership.expiryDate).toISOString() : 'N/A',
      totalCheckins: u.check_in_count || 0,
    }));

    sendResponse(res, HttpStatus.OK, "Users fetched successfully", mappedUsers);

  })

  // ---------------------------
  // Toggle user status
  // ---------------------------
  toggleUserStatus = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string;
    const { action } = req.body; // 'activate' or 'suspend'
    
    let user;
    if (action === 'suspend') {
      user = await this.adminService.blockUser(id);
    } else {
      user = await this.adminService.unblockUser(id);
    }

    const mappedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status === 'ACTIVE' ? 'Active' : (user.status === 'SUSPENDED' ? 'Suspended' : user.status),
      membershipPlan: user.active_membership?.plan || 'No Plan',
      expiryDate: user.active_membership?.expiryDate ? new Date(user.active_membership.expiryDate).toISOString() : 'N/A',
      totalCheckins: user.check_in_count || 0,
    };

    sendResponse(res, HttpStatus.OK, "User status updated successfully", mappedUser);

  })

}