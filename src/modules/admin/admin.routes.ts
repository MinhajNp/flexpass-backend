import { Router } from "express"
import { AdminController } from "./admin.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { authorizeRoles } from "../../middlewares/role.middleware"
import { Role } from "../../enums/role.enum"
import { container } from "../../container/container"
import { TYPES } from "../../types/type"

const router = Router()
const adminController = container.get<AdminController>(TYPES.AdminController);

router.get(
  "/users",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getAllUsers
)

export default router