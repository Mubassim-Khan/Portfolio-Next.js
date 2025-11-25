import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Clear all cookies with consistent flags
  const opts = {
    httpOnly: true,
    secure: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 0,
  };

  cookieStore.set("session", "", opts);
  cookieStore.set("otp_hash", "", opts);
  cookieStore.set("otp_timestamp", "", opts);

  return NextResponse.json(
    { success: true, message: "Successfully signed out" },
    { status: 200 }
  );
}
