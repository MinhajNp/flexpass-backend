import { Express } from "express"

import authRoutes from "../modules/auth/auth.routes"
import gymRoutes from "../modules/gym/gym.routes"

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoutes)
  app.use("/api/gyms", gymRoutes)
}