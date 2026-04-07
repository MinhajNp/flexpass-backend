import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { registerRoutes } from "./routes"
import { errorMiddleware } from "./shared/middlewares/error.middleware"
import { env } from "./core/config/env"

import path from "path"

const app = express()

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Static Files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")))

registerRoutes(app)

app.use(errorMiddleware)

export default app