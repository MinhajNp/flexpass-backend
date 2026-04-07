import { Router } from "express"
import { GymController } from "../controllers/gym.controller";
import { GymAdminController } from "../controllers/gymAdmin.controller";
import container from "../../../core/container/container";
import { TYPES } from "../../../core/container/types";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { authorizeRoles } from "../../../shared/middlewares/role.middleware";
import { Role } from "../../../shared/enums/role.enum";
import { validateRegistrationToken } from "../middlewares/token.middleware";
import { gymUpload } from "../../../shared/middlewares/upload.middleware";


const router = Router()
const gymController = container.get<GymController>(TYPES.GymController);
const gymAdminController = container.get<GymAdminController>(TYPES.GymAdminController);

// --------------------------------------------------
// Gym Application Routes
// --------------------------------------------------

router.post("/apply", gymUpload, gymController.applyGym)

router.patch("/:id/reapply", gymController.reapplyGym)


// --------------------------------------------------
// Admin Gym Management Routes
// --------------------------------------------------

router.get(
  "/admin/applications",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.getApplications
)

router.get(
  "/admin/applications/:id",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.getApplicationById
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

router.patch(
  "/admin/applications/:id/status",
  authMiddleware,
  authorizeRoles(Role.PLATFORM_ADMIN),
  gymController.updateApplicationStatus
)

router.get("/registration/verify", validateRegistrationToken, gymController.verifyRegistrationToken)
router.post("/registration/complete", validateRegistrationToken, gymController.completeRegistration)

// --------------------------------------------------
// Gym Admin Portal Routes
// --------------------------------------------------

router.get(
  "/:gymId/dashboard/stats",
  authMiddleware,
  authorizeRoles(Role.GYM_ADMIN, Role.PLATFORM_ADMIN),
  gymAdminController.getDashboardStats
)

router.get(
  "/:gymId/slots/today",
  authMiddleware,
  authorizeRoles(Role.GYM_ADMIN, Role.PLATFORM_ADMIN),
  gymAdminController.getTodaySlots
)

router.get(
  "/:gymId/check-ins/recent",
  authMiddleware,
  authorizeRoles(Role.GYM_ADMIN, Role.PLATFORM_ADMIN),
  gymAdminController.getRecentCheckIns
)

router.post(
  "/:gymId/check-in",
  authMiddleware,
  authorizeRoles(Role.GYM_ADMIN),
  gymAdminController.processCheckIn
)

export default router