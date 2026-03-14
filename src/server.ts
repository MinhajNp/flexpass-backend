import "reflect-metadata"
import app from "./app"
import { env } from "./config/env"
import { connectDB } from "./config/db"
import { logger } from "./utils/logger"

const startServer = async () => {
  await connectDB()

  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT}`)
  })
}

startServer()