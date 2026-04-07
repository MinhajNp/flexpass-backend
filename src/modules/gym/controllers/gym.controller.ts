import { Request, Response } from "express"
import multer from "multer"
import "multer"
import { inject, injectable } from "inversify"

import { IGymApplicationService } from "../interfaces/IGymApplicationService"
import { TYPES } from "../../../core/container/types"

import { asyncHandler } from "../../../shared/utils/asyncHandler"
import { sendResponse } from "../../../shared/utils/response"

import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { AppError } from "../../../shared/utils/AppError"
import { GymMessages } from "../../../shared/constants/messages/gym.messages"

import { mapGymToResponseDTO, mapRequestToApplyGymDTO } from "../mappers/gym.mapper"
import {
  applyGymSchema,
  approveGymSchema,
  rejectGymSchema,
  completeRegistrationSchema
} from "../validators/gym.vaidation"

@injectable()
export class GymController {

  constructor(
    @inject(TYPES.IGymApplicationService)
    private gymService: IGymApplicationService
  ) {}

  // -----------------------------------------
  // Apply Gym
  // -----------------------------------------
  applyGym = asyncHandler(async (req: Request, res: Response) => {
    // 1. Map Request to DTO using GymMapper (handles parsing and document mapping)
    const dataToValidate = mapRequestToApplyGymDTO(req);

    // 2. Validate consolidated data
    const validatedData = applyGymSchema.parse(dataToValidate);

    const result = await this.gymService.applyGym(validatedData);

    sendResponse(res, HttpStatus.CREATED, GymMessages.APPLICATION_SUBMITTED, result);
  });

  // -----------------------------------------
  // Get Pending Gyms
  // -----------------------------------------
  getPendingGyms = asyncHandler(async (_req: Request, res: Response) => {

    const result = await this.gymService.getPendingGyms()

    sendResponse(res, HttpStatus.OK, GymMessages.PENDING_GYMS_FETCHED, result)

  })

  // -----------------------------------------
  // Get Approved Gyms
  // -----------------------------------------
  getApprovedGyms = asyncHandler(async (_req: Request, res: Response) => {

    const result = await this.gymService.getApprovedGyms()

    sendResponse(res, HttpStatus.OK, GymMessages.APPROVED_GYMS_FETCHED, result)

  })

  // -----------------------------------------
  // Get Applications
  // -----------------------------------------
  getApplications = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { applications, totalCount } = await this.gymService.getApplications(page, limit);

    sendResponse(res, HttpStatus.OK, GymMessages.APPLICATIONS_FETCHED, { data: applications, totalCount, currentPage: page });
  })

  // -----------------------------------------
  // Approve Gym
  // -----------------------------------------
  approveGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string
    const validatedData = approveGymSchema.parse(req.body)

    const result = await this.gymService.approveGym(id, validatedData.category)

    sendResponse(res, HttpStatus.OK, GymMessages.GYM_APPROVED, result)

  })

  // -----------------------------------------
  // Get Application By ID
  // -----------------------------------------
  getApplicationById = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    if (!id) {
      throw new AppError(GymMessages.GYM_ID_REQUIRED, HttpStatus.BAD_REQUEST)
    }

    const result = await this.gymService.getApplicationById(id)

    if (!result) {
      throw new AppError(GymMessages.APPLICATION_NOT_FOUND, HttpStatus.NOT_FOUND)
    }

    sendResponse(res, HttpStatus.OK, GymMessages.APPLICATION_FETCHED, result)

  })


  // -----------------------------------------
  // Reject Gym
  // -----------------------------------------
  rejectGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    if (!id) {
      throw new AppError(GymMessages.GYM_ID_REQUIRED, HttpStatus.BAD_REQUEST)
    }

    const validatedData = rejectGymSchema.parse(req.body)

    const result = await this.gymService.rejectGym(id, validatedData.reason)

    sendResponse(res, HttpStatus.OK, GymMessages.GYM_REJECTED, result)

  })

  // -----------------------------------------
  // Update Application Status
  // -----------------------------------------
  updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    if (!id) {
      throw new AppError(GymMessages.GYM_ID_REQUIRED, HttpStatus.BAD_REQUEST)
    }

    const result = await this.gymService.updateApplicationStatus(id, req.body)

    sendResponse(res, HttpStatus.OK, GymMessages.APPLICATION_UPDATED, result)

  })

  // -----------------------------------------
  // Reapply Gym
  // -----------------------------------------
  reapplyGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    if (!id) {
      throw new AppError(GymMessages.GYM_ID_REQUIRED, HttpStatus.BAD_REQUEST)
    }

    const result = await this.gymService.reapplyGym(id)

    sendResponse(res, HttpStatus.OK, GymMessages.REAPPLY_SUCCESS, result)

  })

  // -----------------------------------------
  // Registration Flow
  // -----------------------------------------
  verifyRegistrationToken = asyncHandler(async (req: Request, res: Response) => {
    const token = req.query.token as string

    if (!token) {
      throw new AppError(GymMessages.TOKEN_REQUIRED, HttpStatus.BAD_REQUEST)
    }

    const result = await this.gymService.validateRegistrationToken(token)

    sendResponse(res, HttpStatus.OK, GymMessages.REGISTRATION_TOKEN_VALID, result)
  })

  completeRegistration = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = completeRegistrationSchema.parse(req.body)

    await this.gymService.completeRegistration(validatedData)

    sendResponse(res, HttpStatus.OK, GymMessages.REGISTRATION_COMPLETE)
  })

}