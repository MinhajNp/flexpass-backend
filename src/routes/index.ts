import { Express } from "express"

import authRoutes from "../modules/auth/auth.routes"
import gymRoutes from "../modules/gym/gym.routes"
import adminRoutes from "../modules/admin/admin.routes"

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoutes)
  app.use("/api/gyms", gymRoutes)
  app.use("/api/admin", adminRoutes)
}

