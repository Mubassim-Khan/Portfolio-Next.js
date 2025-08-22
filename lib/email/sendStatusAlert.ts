import nodemailer from "nodemailer";
import statusEmailTemplate from "./templates/statusEmailTemplate";

export const sendStatusAlert = async (
  to: string,
  projectName: string,
  status: boolean,
  errorMsg?: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Dashboard" <${process.env.SMTP_USER!}>`,
      to,
      subject: `[${status ? "UP" : "DOWN"}] ${projectName} - Status Alert`,
      html: statusEmailTemplate(projectName, status, errorMsg),
    });

    console.log(
      `Status email sent for ${projectName}: ${status ? "UP" : "DOWN"}`
    );
  } catch (err) {
    console.error("Failed to send status alert email:", err);
  }
};
