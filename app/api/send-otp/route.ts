import { cookies } from "next/headers";
import { generateOTP } from "@/lib/utils/generateOTP";

export async function POST(req: Request) {
  const otp = generateOTP();
  const timestamp = Date.now();

  const cookieStore = await cookies();
  cookieStore.set("otp", otp, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  cookieStore.set("otp_timestamp", timestamp.toString(), {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 2,
  });

  return Response.json({ success: true, otp }); // return otp to client
}
