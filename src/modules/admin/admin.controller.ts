import { Request, Response } from "express"
import { asyncHandler } from "../../shared/utils/asyncHandler"
import { sendResponse } from "../../shared/utils/response"
import { IAdminService } from "./interfaces/IAdminService"
import { inject, injectable } from "inversify"
import { TYPES } from "../../core/container/types"



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