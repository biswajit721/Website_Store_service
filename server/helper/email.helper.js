import nodemailer from "nodemailer";

export const sendEmail = async (
  to,
  subject,
  html,
) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_USER,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.PLAINEMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your Company" <${process.env.EMAIL_USER}>`,
    to,
    subject:`Meeting Confirmation - ${subject}`,
    html,
  };

  return transporter.sendMail(mailOptions);
};