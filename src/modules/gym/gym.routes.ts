import { Router } from "express"
import { GymController } from "./gym.controller"
import { authMiddleware } from "../../middlewares/auth.middleware"
import { authorizeRoles } from "../../middlewares/role.middleware"
import { Role } from "../../enums/role.enum"

const router = Router()

const gymController = new GymController()



router.post("/apply",gymController.applyGym)
router.patch("/:id/reapply",gymController.reapplyGym)

router.get(
  "/admin/gyms",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.getPendingGyms
)

router.patch(
  "/admin/gyms/:id/approve",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.approveGym
)

router.patch(
  "/admin/gyms/:id/reject",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.rejectGym
)

export default router