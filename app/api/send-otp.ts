import { generateOTP } from "@/lib/utils/generateOTP";
import { sendEmail } from "@/lib/email/sendEmail";

export async function POST(req: Request) {
  const otp = generateOTP();
  const email = process.env.MY_EMAIL!;
  const timestamp = Date.now();

  await sendEmail(email, "otp-template", { otp });

  // Store OTP securely (e.g., encrypted cookie, DB, or memory)
  return Response.json({ success: true, timestamp });
}
