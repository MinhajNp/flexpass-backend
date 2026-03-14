import { Request, Response } from "express"
import { asyncHandler } from "../../utils/asyncHandler"
import { sendResponse } from "../../utils/response"
import { IAdminService } from "../../interfaces/services/admin.service.interface"
import { inject, injectable } from "inversify"
import { TYPES } from "../../types/type"


@injectable()
export class AdminController {

  constructor(
    @inject(TYPES.IAdminService)
    private _adminService : IAdminService
  ){}

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {

    const result = await this._adminService.getAllUsers()

    sendResponse(res, 200, "Users fetched successfully", result)

  })

}