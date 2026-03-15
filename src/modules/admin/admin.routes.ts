import { Router } from "express"
import { AdminController } from "./admin.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { authorizeRoles } from "../../middlewares/role.middleware"
import { Role } from "../../enums/role.enum"
import { TYPES } from "../../container/types"
import container from "../../container/container"

const router = Router()
const adminController = container.get<AdminController>(TYPES.AdminController);

router.get(
  "/users",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getAllUsers
)

export default router