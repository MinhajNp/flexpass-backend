import "reflect-metadata"
import app from "./app"
import { env } from "./core/config/env"
import { connectDB } from "./core/config/db"
import { logger } from "./shared/utils/logger"

const startServer = async () => {
  await connectDB()

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`)
  })
}

startServer()