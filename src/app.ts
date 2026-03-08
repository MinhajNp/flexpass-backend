import express from "express"
import cors from "cors"

import { errorMiddleware } from "./middlewares/error.middleware"

const app = express()

app.use(cors())
app.use(express.json())


app.use(errorMiddleware)

export default app