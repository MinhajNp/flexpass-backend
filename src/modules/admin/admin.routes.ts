import { Router } from "express"
import { TYPES } from "../../core/container/types"

import { AdminController } from "./admin.controller"

import { authorizeRoles } from "../../shared/middlewares/role.middleware"
import { authMiddleware } from "../../shared/middlewares/auth.middleware"

import { Role } from "../../shared/enums/role.enum"
import container from "../../core/container/container"


const router = Router()

const adminController = container.get<AdminController>(TYPES.AdminController)

router.get(
  "/users",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getUsers
)

router.patch(
  "/users/:id/block",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.blockUser
)

router.patch(
  "/users/:id/unblock",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.unblockUser
)

export default router