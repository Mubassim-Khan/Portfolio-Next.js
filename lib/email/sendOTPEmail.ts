import nodemailer from "nodemailer";
import otpEmailTemplate from "@/lib/email/templates/otpEmailTemplate";

// For OTP Email using Nodemailer
export const sendOTPEmail = async (
  to: string,
  otp: string
): Promise<{ success: boolean }> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT!),
      secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    await transporter.sendMail({
      from: `"Portfolio Dashboard -" <${process.env.SMTP_USER!}>`,
      to,
      subject: "[Important] - OTP Code Verification Request",
      html: otpEmailTemplate(otp),
    });

    return { success: true };
  } catch (err) {
    console.error("Nodemailer error:", err);
    return { success: false };
  }
};
