import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { generateOTP } from "@/lib/utils/generateOTP";
import { sendOTPEmail } from "@/lib/email/sendOTPEmail";

export async function POST() {
  const otp = generateOTP();
  const timestamp = Date.now();

  // Hash the OTP before storing it
  const saltRounds = 10;
  const hashedOtp = await bcrypt.hash(otp, saltRounds);

  const cookieStore = await cookies();
  const otpValidDuration = 1000 * 60 * 60 * 2; // 2 hours

  // Store the HASHED OTP and its timestamp in secure, HttpOnly cookies
  cookieStore.set("otp_hash", hashedOtp, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: otpValidDuration / 1000,
  });
  cookieStore.set("otp_timestamp", timestamp.toString(), {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: otpValidDuration / 1000,
  });

  // Send OTP via Nodemailer
  const emailResult = await sendOTPEmail(process.env.MY_EMAIL!, otp);

  if (!emailResult.success) {
    return NextResponse.json(
      { success: false, message: "Failed to send OTP" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "OTP sent successfully.",
  });
}
