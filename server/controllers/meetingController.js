import { sendEmailMeeting } from "../email/meetingEmailSend.js";
import meeting from "../models/meeting.model.js";

// CREATE MEETING
export const createMeeting = async (req, res) => {
  try {
    const {
      clientName,
      phone,
      email,
      subject,
      DOM,
      meetingUrl,
      location,
      meetingType,
      message,
    } = req.body;

    // Validation
    if (!clientName || !phone || !email || !subject || !DOM) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be filled",
      });
    }

    const newMeeting = await meeting.create({
      clientName,
      phone,
      email,
      subject,
      DOM,
      meetingUrl,
      location,
      meetingType,
      message,
    });

    res.status(201).json({
      success: true,
      message: "Meeting created successfully ",
      data: newMeeting,
    });
   await sendEmailMeeting(newMeeting)


  } catch (error) {
    console.error("Create Meeting Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getAllMeetings = async (req, res) => {
  try {
    const meetings = await meeting.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: meetings.length,
      data: meetings,
    });

  } catch (error) {
    console.error("Get Meetings Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const getSingleMeeting = async (req, res) => {
  try {
    const meeting = await meeting.findById(req.params.id);

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      data: meeting,
    });

  } catch (error) {
    console.error("Get Single Meeting Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const updateMeeting = async (req, res) => {
  try {
    const meeting = await meeting.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!meeting) {
      return res.status(404).json({
        success: false,
        message: "Meeting not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Meeting updated successfully",
      data: meeting,
    });

  } catch (error) {
    console.error("Update Meeting Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



export const deleteMeeting = async (req, res) => {
  try {
    const deleteMeeting = await meeting.findByIdAndDelete(req.params.id);

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