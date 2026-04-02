import { Router } from "express"
import { AdminController } from "./admin.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { authorizeRoles } from "../../middlewares/role.middleware"
import { Role } from "../../enums/role.enum"

const router = Router()
const adminController = new AdminController()

router.get(
  "/users",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  adminController.getAllUsers
)

export default router