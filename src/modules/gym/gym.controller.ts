import { Request, Response } from "express"
import { asyncHandler } from "../../shared/utils/asyncHandler"
import { sendResponse } from "../../shared/utils/response"

import { inject, injectable } from "inversify"
import { IGymService } from "./interfaces/IGymService"
import { TYPES } from "../../core/container/types"

@injectable()
export class GymController {

  constructor(
    @inject(TYPES.IGymService)
    private gymService: IGymService
  ) {}

  // --------------------------------------------------
  // Apply Gym
  // --------------------------------------------------

  applyGym = asyncHandler(async (req: Request, res: Response) => {

    const result = await this.gymService.applyGym(req.body)

    sendResponse(res, 201, "Gym application submitted successfully", result)

  })

  // --------------------------------------------------
  // Get Pending Gyms (Admin)
  // --------------------------------------------------

  getPendingGyms = asyncHandler(async (req: Request, res: Response) => {

    const result = await this.gymService.getPendingGyms()

    sendResponse(res, 200, "Pending gyms fetched successfully", result)

  })

  // --------------------------------------------------
  // Get Approved Gyms (Admin)
  // --------------------------------------------------

  getApprovedGyms = asyncHandler(async (req: Request, res: Response) => {

    const result = await this.gymService.getApprovedGyms()

    sendResponse(res, 200, "Gyms fetched successfully", result)

  })

  // --------------------------------------------------
  // Approve Gym
  // --------------------------------------------------

  approveGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    const result = await this.gymService.approveGym(id)

    sendResponse(res, 200, "Gym approved successfully", result)

  })

  // --------------------------------------------------
  // Reject Gym
  // --------------------------------------------------

  rejectGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string
    const { reason } = req.body

    const result = await this.gymService.rejectGym(id, reason)

    sendResponse(res, 200, "Gym rejected successfully", result)

  })

  // --------------------------------------------------
  // Reapply Gym
  // --------------------------------------------------

  reapplyGym = asyncHandler(async (req: Request, res: Response) => {

    const id = req.params.id as string

    const result = await this.gymService.reapplyGym(id)

    sendResponse(res, 200, "Gym reapplied successfully", result)

  })

  // --------------------------------------------------
  // Validate gym invitation link
  // --------------------------------------------------

  validateInvitation = asyncHandler(async (req: Request, res: Response) => {

  const  token  = req.params.token as string

  const result = await this.gymService.validateInvitation(token)

  sendResponse(res, 200,"Invitation valid",result)

})

// --------------------------------------------------
  // Complete Registration as Gym admin
  // --------------------------------------------------

  completeRegistration = asyncHandler(async (req: Request, res: Response) => {

  const { token, name, password } = req.body

  await this.gymService.completeRegistration({ token, name, password })

  sendResponse(res,201,"Gym admin account created successfully")

})

}