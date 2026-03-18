import { Router } from "express"
import { AdminController } from "./admin.controller"
import { authMiddleware } from "../../shared/middlewares/auth.middleware"
import { authorizeRoles } from "../../shared/middlewares/role.middleware"
import { Role } from "../../shared/enums/role.enum"
import { TYPES } from "../../core/container/types"
import container from "../../core/container/container"

const router = Router()
const adminController = container.get<AdminController>(TYPES.AdminController);

router.get(
  "/users",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getAllUsers
)

export default router