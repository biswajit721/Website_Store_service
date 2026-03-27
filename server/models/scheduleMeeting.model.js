import mongoose, { model, Mongoose, Schema } from "mongoose";

const MeetingSchedulingModel = new Schema({
  time: {
    type: String,
    default: Date.now,
  },
  meetingDate: {
    type: String,
    default: Date.now,
  },
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},
  meetingLink: {
    type: String,
    default: "https://meet.google.com/kah-xvke-byd",
  },
});

const schedulingMeeting = model("schedulingMeeting", MeetingSchedulingModel);

export default schedulingMeeting;
