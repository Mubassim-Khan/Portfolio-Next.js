import nodemailer from "nodemailer";
import downAlertEmailTemplate, { type DownProject } from "./templates/downAlertEmailTemplate";

/** Sends ONE email covering every project that is currently down. */
export const sendDownAlert = async (to: string, projects: DownProject[]) => {
  if (!projects.length) return;

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

    const names = projects.map((p) => p.name);
    const subject =
      projects.length === 1
        ? `[DOWN] ${names[0]} - Status Alert`
        : `[DOWN] ${projects.length} projects down: ${names.slice(0, 3).join(", ")}${names.length > 3 ? "…" : ""}`;

    await transporter.sendMail({
      from: `"[Status Alert] - Portfolio Dashboard" <${process.env.SMTP_USER!}>`,
      to,
      subject,
      html: downAlertEmailTemplate(projects),
    });

    console.log(`Down alert sent for ${projects.length} project(s): ${names.join(", ")}`);
  } catch (err) {
    console.error("Failed to send down alert email:", err);
  }
};
