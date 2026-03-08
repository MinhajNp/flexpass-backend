import { Router } from "express"
import { AuthController } from "./auth.controller"

const router = Router()

router.post("/register", AuthController.register)
router.post("/login", AuthController.login)
router.post("/send-otp", AuthController.sendOtp)
router.post("/verify-otp", AuthController.verifyOtp)

router.post("/forgot-password", (req, res) => {
  res.send("forgot password route working")
})

export default router