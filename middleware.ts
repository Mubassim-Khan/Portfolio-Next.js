import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "@/lib/auth/validateSession";

export function middleware(req: NextRequest) {
  const session = req.cookies.get("session")?.value;
  const isValid = isSessionValid(session);

  if (req.nextUrl.pathname.startsWith("/dashboard") && !isValid) {
    return NextResponse.redirect(new URL("/otp", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
