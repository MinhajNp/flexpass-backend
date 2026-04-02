import { Express } from "express"

import authRoutes from "../modules/auth/routes/auth.routes"
import gymRoutes from "../modules/gym/routes/gym.routes"
import adminRoutes from "../modules/admin/routes/admin.routes"

export const registerRoutes = (app: Express) => {
  app.use("/api/auth", authRoutes)
  app.use("/api/gyms", gymRoutes)
  app.use("/api/admin", adminRoutes)
}

