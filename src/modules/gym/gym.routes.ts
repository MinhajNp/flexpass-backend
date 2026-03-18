import { Router } from "express"
import { GymController } from "./gym.controller"
import { authMiddleware } from "../../shared/middlewares/auth.middleware"
import { authorizeRoles } from "../../shared/middlewares/role.middleware"
import { Role } from "../../shared/enums/role.enum"
import { TYPES } from "../../core/container/types"
import container from "../../core/container/container"


const router = Router()
const gymController = container.get<GymController>(TYPES.GymController);

// --------------------------------------------------
// Gym Application Routes
// --------------------------------------------------

router.post("/apply", gymController.applyGym)

router.patch("/:id/reapply", gymController.reapplyGym)


// --------------------------------------------------
// Admin Gym Management Routes
// --------------------------------------------------

router.get(
  "/admin/applications",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.getPendingGyms
)

router.get(
  "/admin",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.getApprovedGyms
)

router.patch(
  "/admin/:id/approve",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.approveGym
)

router.patch(
  "/admin/:id/reject",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.rejectGym
)

export default router