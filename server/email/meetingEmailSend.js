import fs from "fs";
import path from "path";

import { fileURLToPath } from "url";
import { sendEmail } from "../helper/email.helper.js"

// Fix for __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read template once when server starts
const meetingTemplate = fs.readFileSync(
  path.join(__dirname, "../helper/template/meeting.html"),
  "utf-8"
);
const schedulingMeeting = fs.readFileSync(
  path.join(__dirname, "../helper/template/SchedulingMeetingTemp.html"),
  "utf-8"
);

export const sendEmailMeeting = async (meetingData) => {
  try {
    const {
      clientName,
      email,
      subject,
      DOM,
      location,
      meetingType,
      meetingUrl,
    } = meetingData;

    // Replace placeholders in template
    let htmlContent = meetingTemplate
      .replace(/{{clientName}}/g, clientName)
      .replace(/{{subject}}/g, subject)
      .replace(/{{DOM}}/g, DOM)
      .replace(/{{location}}/g, location)
      .replace(/{{meetingType}}/g, meetingType)
      .replace(/{{meetingUrl}}/g, meetingUrl);

    sendEmail(email,subject,htmlContent)
    sendEmail(process.env.EMAIL_USER,`Clinet Wants to Make ${subject}`,htmlContent)

    console.log("Meeting email sent successfully");
    return true;

  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};

export const sendEmailSchedulingMeeting = async (meeting) => {
  try {

    const { meetingDate, time, meetingLink, userId } = meeting;

    const { fullname, email, mobile } = userId;

    const subject = "Meeting Scheduled Successfully";

    const htmlContent = schedulingMeeting
      .replace(/{{clientName}}/g, fullname)
      .replace(/{{mobile}}/g, mobile)
      .replace(/{{meetingDate}}/g, meetingDate)
      .replace(/{{time}}/g, time)
      .replace(/{{meetingUrl}}/g, meetingLink);

    await sendEmail(email, subject, htmlContent);

    console.log("Meeting email sent successfully");

    return true;

  } catch (error) {
    console.error("Email sending error:", error);
    throw error;
  }
};