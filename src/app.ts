import express from "express"
import cors from "cors"
import { registerRoutes } from "./routes"
import { errorMiddleware } from "./shared/middlewares/error.middleware"

const app = express()

app.use(cors())
app.use(express.json())

registerRoutes(app)

app.use(errorMiddleware)

export default app