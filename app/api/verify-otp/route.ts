import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { otp: enteredOtp } = body;

  const cookieStore = await cookies();
  const storedOtp = cookieStore.get("otp")?.value;
  const storedTimestamp = cookieStore.get("otp_timestamp")?.value;

  if (!storedOtp || !storedTimestamp) {
    return NextResponse.json(
      { success: false, message: "OTP expired or missing" },
      { status: 400 }
    );
  }

  const otpValidDuration = 1000 * 60 * 60 * 2; // 2 hours in milliseconds
  const isExpired = Date.now() - parseInt(storedTimestamp) > otpValidDuration;

  if (isExpired) {
    return NextResponse.json(
      { success: false, message: "OTP has expired" },
      { status: 400 }
    );
  }

  if (enteredOtp !== storedOtp) {
    return NextResponse.json(
      { success: false, message: "Invalid OTP" },
      { status: 401 }
    );
  }

  // Clear OTP cookies after successful verification
  cookieStore.set("otp", "", { maxAge: 0 });
  cookieStore.set("otp_timestamp", "", { maxAge: 0 });

  // Create and return a NextResponse with the session cookie set
  const response = NextResponse.json({
    success: true,
    message: "OTP verified",
  });

  const sessionData = {
    createdAt: Date.now(),
    lastActive: Date.now(),
  };

  response.cookies.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
    secure: true,
    sameSite: "lax",
  });

  return response;
}
