// lib/email/sendReportMail.ts
import nodemailer from "nodemailer";
import { reportEmailTemplate } from "@/lib/email/templates/reportTemplate";

export interface SendReportMailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  attachment: {
    filename: string;
    content: Buffer | string;
    contentType?: string;
  };
}

export const sendReportMail = async (
  opts: SendReportMailOptions
): Promise<{ success: boolean; error?: any }> => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const html = opts.html ?? reportEmailTemplate(opts.to, opts.subject);

    await transporter.sendMail({
      from: `"Portfolio Dashboard" <${process.env.SMTP_USER!}>`,
      to: process.env.MY_EMAIL!,
      subject: opts.subject,
      text: opts.text,
      html,
      attachments: [
        {
          filename: opts.attachment.filename,
          content: opts.attachment.content,
          contentType: opts.attachment.contentType,
        },
      ],
    });

    return { success: true };
  } catch (err) {
    console.error("sendReportMail error:", err);
    return { success: false, error: err };
  }
};
