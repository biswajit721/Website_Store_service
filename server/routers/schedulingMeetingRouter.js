import express from "express"
import { verifyToken } from "../middleware/AuthMiddleware.js"
import { createScheduleingMeeting, deleteScheduleMeeting, getAllSchedulingMeeting } from "../controllers/scheduleMeetingController.js"

const meetingScheduling = express.Router()

meetingScheduling.post("/",verifyToken,createScheduleingMeeting)
meetingScheduling.get("/",verifyToken,getAllSchedulingMeeting)
meetingScheduling.delete("/:id",verifyToken,deleteScheduleMeeting)


export default meetingScheduling