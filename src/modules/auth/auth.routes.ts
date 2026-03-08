import { Router } from "express"

const router = Router()

router.post("/register", (req, res) => {
  res.send("register route working")
})

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