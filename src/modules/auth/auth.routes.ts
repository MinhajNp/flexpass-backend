import { Router } from "express"
import { AuthController } from "./auth.controller"

const router = Router()

router.post("/register", AuthController.register)

router.post("/login", (req, res) => {
  res.send("login route working")
})

router.post("/verify-otp", (req, res) => {
  res.send("verify otp route working")
})

router.post("/forgot-password", (req, res) => {
  res.send("forgot password route working")
})

export default router