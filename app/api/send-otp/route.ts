import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { generateOTP } from "@/lib/utils/generateOTP";
import bcrypt from "bcrypt"; // Import bcrypt

export async function POST(req: Request) {
  const otp = generateOTP();
  const timestamp = Date.now();

  // Hash the OTP before storing it
  const saltRounds = 10;
  const hashedOtp = await bcrypt.hash(otp, saltRounds);

  const cookieStore = await cookies();
  const otpValidDuration = 1000 * 60 * 5; // Set a shorter, more secure duration (e.g., 5 minutes)

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

  return NextResponse.json({
    success: true,
    otp,
    message: "OTP sent successfully.",
  });
}
