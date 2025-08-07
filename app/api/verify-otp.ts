import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { otp: enteredOtp } = body;

  const cookieStore = await cookies();
  const storedOtp = cookieStore.get("otp")?.value;
  const storedTimestamp = cookieStore.get("otp_timestamp")?.value;

  if (!storedOtp || !storedTimestamp) {
    return Response.json(
      { success: false, message: "OTP expired or missing" },
      { status: 400 }
    );
  }

  const otpValidDuration = 1000 * 60 * 60 * 2; // 2 hours in milliseconds
  const isExpired = Date.now() - parseInt(storedTimestamp) > otpValidDuration;

  if (isExpired) {
    return Response.json(
      { success: false, message: "OTP has expired" },
      { status: 400 }
    );
  }

  if (enteredOtp !== storedOtp) {
    return Response.json(
      { success: false, message: "Invalid OTP" },
      { status: 401 }
    );
  }

  // Optionally clear OTP after successful verification
  cookieStore.set("otp", "", { maxAge: 0 });
  cookieStore.set("otp_timestamp", "", { maxAge: 0 });

  return Response.json({ success: true, message: "OTP verified" });
}
