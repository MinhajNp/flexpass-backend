import { Router } from "express"

import container from "../../../core/container/container"
import { TYPES } from "../../../core/container/types"

import { AuthController } from "../controllers/auth.controller"

const router = Router()

const authController = container.get<AuthController>(TYPES.AuthController)

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/verify-otp", authController.verifyOtp)
router.post("/forgot-password", authController.forgotPassword)
router.post("/reset-password", authController.resetPassword)
router.post("/refresh-token", authController.refreshToken)
router.post("/logout",authController.logout)

export default router