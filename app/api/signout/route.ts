import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Clear session cookie
  cookieStore.set("session", "", { maxAge: 0, path: "/" });

  // Clear any leftover OTP-related cookies (optional safety)
  cookieStore.set("otp_hash", "", { maxAge: 0, path: "/" });
  cookieStore.set("otp_timestamp", "", { maxAge: 0, path: "/" });

  return NextResponse.json(
    { success: true, message: "Successfully signed out" },
    { status: 200 }
  );
}
