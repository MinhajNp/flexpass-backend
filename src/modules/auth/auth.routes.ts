import { Router } from "express"

import container from "../../core/container/container"
import { TYPES } from "../../core/container/types"

import { AuthController } from "./auth.controller"

const router = Router()

const authController = container.get<AuthController>(TYPES.AuthController)

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/send-otp", authController.sendOtp)
router.post("/verify-otp", authController.verifyOtp)
router.post("/reset-password", authController.resetPassword)

export default router