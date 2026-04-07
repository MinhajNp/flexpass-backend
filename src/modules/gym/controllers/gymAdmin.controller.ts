import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IGymAdminService } from "../interfaces/IGymAdminService";
import { TYPES } from "../../../core/container/types";
import { asyncHandler } from "../../../shared/utils/asyncHandler";
import { sendResponse } from "../../../shared/utils/response";
import { HttpStatus } from "../../../shared/enums/httpStatus.enum";
import { AppError } from "../../../shared/utils/AppError";
import { GymMessages } from "../../../shared/constants/messages/gym.messages";

@injectable()
export class GymAdminController {
  constructor(
    @inject(TYPES.IGymAdminService) private gymAdminService: IGymAdminService
  ) {}

  getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const gymId = req.params.gymId as string;
    if (!gymId) throw new AppError(GymMessages.GYM_ID_REQUIRED, HttpStatus.BAD_REQUEST);
    
    const stats = await this.gymAdminService.getDashboardStats(gymId);
    sendResponse(res, HttpStatus.OK, GymMessages.DASHBOARD_STATS_FETCHED, stats);
  });

  getTodaySlots = asyncHandler(async (req: Request, res: Response) => {
    const gymId = req.params.gymId as string;
    if (!gymId) throw new AppError(GymMessages.GYM_ID_REQUIRED, HttpStatus.BAD_REQUEST);

    const slots = await this.gymAdminService.getTodaySlots(gymId);
    sendResponse(res, HttpStatus.OK, GymMessages.TODAY_SLOTS_FETCHED, slots);
  });

  getRecentCheckIns = asyncHandler(async (req: Request, res: Response) => {
    const gymId = req.params.gymId as string;
    if (!gymId) throw new AppError(GymMessages.GYM_ID_REQUIRED, HttpStatus.BAD_REQUEST);

    const checkIns = await this.gymAdminService.getRecentCheckIns(gymId);
    sendResponse(res, HttpStatus.OK, GymMessages.RECENT_CHECKINS_FETCHED, checkIns);
  });

  processCheckIn = asyncHandler(async (req: Request, res: Response) => {
    const gymId = req.params.gymId as string;
    const { userId, type } = req.body;
    
    if (!gymId || !userId || !type) {
      throw new AppError(GymMessages.MISSING_REQUIRED_FIELDS, HttpStatus.BAD_REQUEST);
    }

    const result = await this.gymAdminService.processCheckIn(gymId, userId, type);
    sendResponse(res, HttpStatus.CREATED, GymMessages.CHECKIN_PROCESSED, result);
  });
}
