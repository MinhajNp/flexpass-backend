import { Request, Response } from "express"
import { inject, injectable } from "inversify"

import { TYPES } from "../../core/container/types"

import { IUserService } from "../user/interfaces/IUserService"

import { asyncHandler } from "../../shared/utils/asyncHandler"
import { sendResponse } from "../../shared/utils/response"

import { HttpStatus } from "../../shared/enums/httpStatus.enum"

@injectable()
export class AdminController {

  constructor(
    @inject(TYPES.IUserService)
    private userService: IUserService
  ) {}

  // ---------------------------
  // Get all users
  // ---------------------------

  getUsers = asyncHandler(async (req: Request, res: Response) => {

    const users = await this.userService.getUsers()

    sendResponse(res, HttpStatus.OK,"Users fetched successfully", users)

  })

  // ---------------------------
  // Block user
  // ---------------------------

  blockUser = asyncHandler(async (req: Request, res: Response) => {

    const id  = req.params.id as string

    const user = await this.userService.blockUser(id)

    sendResponse(res, HttpStatus.OK,"User blocked successfully",user)

  })

  // ---------------------------
  // Unblock user
  // ---------------------------

  unblockUser = asyncHandler(async (req: Request, res: Response) => {

    const  id  = req.params.id as string

    const user = await this.userService.unblockUser(id)

    sendResponse(res, HttpStatus.OK,"User unblocked successfully",user)

  })

}