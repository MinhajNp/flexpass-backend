import { Router } from "express"
import { GymController } from "../controllers/gym.controller";
import container from "../../../core/container/container";
import { TYPES } from "../../../core/container/types";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware";
import { Role } from "../../../shared/enums/role.enum";



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

router.get("/invitation/:token", gymController.validateInvitation)
router.post("/complete-registration", gymController.completeRegistration)

export default router