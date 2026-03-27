import express from "express";
import { createMeeting, deleteMeeting, getAllMeetings, getSingleMeeting, updateMeeting } from "../controllers/meetingController.js";
import { verifyToken } from "../middleware/AuthMiddleware.js";

const meetingRoute = express.Router()

meetingRoute.post("/create", verifyToken ,createMeeting)
meetingRoute.get("/",verifyToken,getAllMeetings)
meetingRoute.get("/:id",verifyToken,getSingleMeeting)
meetingRoute.put("/:id",verifyToken,updateMeeting)
meetingRoute.delete("/:id",verifyToken ,deleteMeeting)


export default meetingRoute