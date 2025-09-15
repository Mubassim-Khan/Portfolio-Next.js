import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { otp: enteredOtp } = body;

  const cookieStore = await cookies();
  const storedOtpHash = cookieStore.get("otp_hash")?.value; // Retrieve the OTP hash
  const storedTimestamp = cookieStore.get("otp_timestamp")?.value;

  // Check if OTP hash or timestamp is missing
  if (!storedOtpHash || !storedTimestamp) {
    return NextResponse.json(
      { success: false, message: "OTP expired or missing" },
      { status: 400 }
    );
  }

  // Set a shorter, more secure OTP valid duration (e.g., 5 minutes)
  const otpValidDuration = 1000 * 60 * 5;
  const isExpired = Date.now() - parseInt(storedTimestamp) > otpValidDuration;

  if (isExpired) {
    const res = NextResponse.json(
      { success: false, message: "OTP has expired" },
      { status: 400 }
    );

    res.cookies.set("otp_hash", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    res.cookies.set("otp_timestamp", "", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return res;
  }

  // Compare the entered OTP with the stored HASH
  const isMatch = await bcrypt.compare(enteredOtp, storedOtpHash);

  if (!isMatch) {
    return NextResponse.json(
      { success: false, message: "Invalid OTP" },
      { status: 401 }
    );
  }

  // OTP valid → clear OTP cookies and set session cookie
  const sessionData = {
    createdAt: Date.now(),
    lastActive: Date.now(),
  };

  const res = NextResponse.json(
    { success: true, message: "OTP verified" },
    { status: 200 }
  );

  res.cookies.set("otp_hash", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set("otp_timestamp", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set("session", JSON.stringify(sessionData), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12, // 12 hours
  });

  return res;
}
