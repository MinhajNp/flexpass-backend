import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { IGymService } from "../interfaces/IGymService"
import { TYPES } from "../../../core/container/types"

import { asyncHandler } from "../../../shared/utils/asyncHandler"
import { sendResponse } from "../../../shared/utils/response"

import { HttpStatus } from "../../../shared/enums/httpStatus.enum"
import { AppError } from "../../../shared/utils/AppError"

import {
  applyGymSchema,
  rejectGymSchema,
  completeRegistrationSchema
} from "../validators/gym.vaidation"

@injectable()
export class GymController {

  constructor(
    @inject(TYPES.IGymService)
    private gymService: IGymService
  ) {}

  // -----------------------------------------
  // Apply Gym
  // -----------------------------------------
  applyGym = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = applyGymSchema.parse(req.body)

    const result = await this.gymService.applyGym(validatedData)

    sendResponse(res, HttpStatus.CREATED, "Gym application submitted successfully", result)

  })

  // -----------------------------------------
  // Get Pending Gyms
  // -----------------------------------------
  getPendingGyms = asyncHandler(async (_req: Request, res: Response) => {

    const result = await this.gymService.getPendingGyms()

    sendResponse(res, HttpStatus.OK, "Pending gyms fetched successfully", result)

  })

  // -----------------------------------------
  // Get Approved Gyms
  // -----------------------------------------
  getApprovedGyms = asyncHandler(async (_req: Request, res: Response) => {

    const result = await this.gymService.getApprovedGyms()

    sendResponse(res, HttpStatus.OK, "Approved gyms fetched successfully", result)

  })

  // -----------------------------------------
  // Approve Gym
  // -----------------------------------------
  approveGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    if (!id) {
      throw new AppError("Gym ID is required", HttpStatus.BAD_REQUEST)
    }

    const result = await this.gymService.approveGym(id)

    sendResponse(res, HttpStatus.OK, "Gym approved successfully", result)

  })

  // -----------------------------------------
  // Reject Gym
  // -----------------------------------------
  rejectGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    if (!id) {
      throw new AppError("Gym ID is required", HttpStatus.BAD_REQUEST)
    }

    const validatedData = rejectGymSchema.parse(req.body)

    const result = await this.gymService.rejectGym(id, validatedData.reason)

    sendResponse(res, HttpStatus.OK, "Gym rejected successfully", result)

  })

  // -----------------------------------------
  // Reapply Gym
  // -----------------------------------------
  reapplyGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    if (!id) {
      throw new AppError("Gym ID is required", HttpStatus.BAD_REQUEST)
    }

    const result = await this.gymService.reapplyGym(id)

    sendResponse(res, HttpStatus.OK, "Gym reapplied successfully", result)

  })

  // -----------------------------------------
  // Validate Invitation
  // -----------------------------------------
  validateInvitation = asyncHandler(async (req: Request, res: Response) => {

    const token = req.params.token as string

    if (!token) {
      throw new AppError("Token is required", HttpStatus.BAD_REQUEST)
    }

    const result = await this.gymService.validateInvitation(token)

    sendResponse(res, HttpStatus.OK, "Invitation valid", result)

  })

  // -----------------------------------------
  // Complete Registration
  // -----------------------------------------
  completeRegistration = asyncHandler(async (req: Request, res: Response) => {

    const validatedData = completeRegistrationSchema.parse(req.body)

    await this.gymService.completeRegistration(validatedData)

    sendResponse(res, HttpStatus.CREATED, "Gym admin account created successfully")

  })

}