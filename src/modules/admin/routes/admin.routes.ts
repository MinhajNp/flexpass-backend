import { Router } from "express"
import { TYPES } from "../../../core/container/types"

import { AdminController } from ".././controllers/admin.controller"

import { authorizeRoles } from "../../../shared/middlewares/role.middleware"
import { authMiddleware } from "../../../shared/middlewares/auth.middleware"

import { Role } from "../../../shared/enums/role.enum"
import container from "../../../core/container/container"


const router = Router()

const adminController = container.get<AdminController>(TYPES.AdminController)

router.get(
  "/gyms/stats",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getGymManagementStats
)

router.get(
  "/gyms",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getPartnerGyms
)

router.patch(
  "/gyms/:id/status",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.updateGymStatus
)

router.get(
  "/dashboard/stats",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getDashboardStats
)

router.get(
  "/users",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getAllUsers
)

router.patch(
  "/users/:id/status",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.toggleUserStatus
)

export default router