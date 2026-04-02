import { Request, Response } from "express"
import { AdminService } from "./admin.service"
import { asyncHandler } from "../../utils/asyncHandler"
import { sendResponse } from "../../utils/response"

export class AdminController {

  private adminService = new AdminService()

  getAllUsers = asyncHandler(async (req: Request, res: Response) => {

    const result = await this.adminService.getAllUsers()

    sendResponse(res, 200, "Users fetched successfully", result)

  })

}