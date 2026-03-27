
import { sendEmailSchedulingMeeting } from "../email/meetingEmailSend.js"
import schedulingMeeting from "../models/scheduleMeeting.model.js"

export const createScheduleingMeeting = async (req, res) => {
    try {

        const user = req.user
        console.log("users---->",user)
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized User",
                success: false
            })
        }

        const { meetingDate, time, meetingLink } = req.body

        if (!meetingDate || !time) {
            return res.status(400).json({
                message: "All fields are required!",
                success: false
            })
        }

        const meeting = await schedulingMeeting.create({
            meetingDate,
            time,
            meetingLink,
            userId: user.id
        })

        await meeting.populate("userId")

     

        await sendEmailSchedulingMeeting(meeting)

        return res.status(201).json({
            message: "Meeting Scheduled Successfully",
            success: true,
            meeting
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Server Error",
            success: false
        })
    }
}

export const getAllSchedulingMeeting = async (req,res)=>{
    try {
      const allMeeting =  await schedulingMeeting.find({}).populate("userId")
      if(!allMeeting){
        return res.status(401).json({message:"Failed to get Meetings",success:false})
      }

      res.status(201).json({message:"All Meeting Get Successfully !",success:true,data:allMeeting})
    } catch (error) {
      res.status(401).json({message:"Error While Getting all Meeting",success:false})
    }
}

export const deleteScheduleMeeting = async (req, res) => {
  try {
    const deleteMeeting = await schedulingMeeting.findByIdAndDelete(req.params.id);

    if (!deleteMeeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting deleted successfully",
    });

  } catch (error) {
    console.error("Delete Meeting Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};