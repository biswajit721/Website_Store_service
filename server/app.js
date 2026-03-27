import express from "express"
import authRouter from "./routers/authRouter.js"
import serviceRouter from "./routers/serviceRouter.js"
import dotenv from "dotenv"
import cors from "cors"
import categoryRoute from "./routers/categoryRoute.js"
import meetingRoute from "./routers/contactRouter.js"
import meetingScheduling from "./routers/schedulingMeetingRouter.js"

dotenv.config()

const app = express()
app.use(cors({
  origin: ["http://localhost:5173","http://localhost:5174"],
    methods:["POST","GET","PUT","DELETE"],

  credentials: true
}));


app.use(express.json())

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/service",serviceRouter)
app.use("/api/v1/category",categoryRoute)
app.use("/api/v1/meeting",meetingRoute)
app.use("/api/v1/meeting-scheduling",meetingScheduling)

export default app
