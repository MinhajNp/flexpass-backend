import { Router } from "express"
import { AuthController } from "./auth.controller"
import { container } from "../../container/container";
import { TYPES } from "../../types/type";

const router = Router()
const authController = container.get<AuthController>(TYPES.AuthController);

router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/send-otp", authController.sendOtp)
router.post("/verify-otp", authController.verifyOtp)
router.post("/reset-password", authController.resetPassword)

export default router