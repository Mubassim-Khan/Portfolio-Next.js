import { cookies } from "next/headers";
import { generateOTP } from "@/lib/utils/generateOTP";
import { sendEmail } from "@/lib/email/sendEmail";

export async function POST(req: Request) {
  const otp = generateOTP();
  const email = process.env.MY_EMAIL!;
  const timestamp = Date.now();

  await sendEmail(email, "otp-template", { otp });

  const cookieStore = await cookies();
  cookieStore.set("otp", otp, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 2, // 2 hours
  });
  cookieStore.set("otp_timestamp", timestamp.toString(), {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  return Response.json({ success: true });
}
