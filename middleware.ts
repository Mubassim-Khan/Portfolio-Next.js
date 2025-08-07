import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "@/lib/auth/validateSession";

export function middleware(req: NextRequest) {
  console.log("Middleware Path:", req.nextUrl.pathname);
  const session = req.cookies.get("session")?.value;
  console.log("Middleware sees session cookie:", session); // <--- Add this

  const isValid = isSessionValid(session);
  console.log("Is session valid (according to middleware):", isValid); // <--- Add this

  if (req.nextUrl.pathname.startsWith("/dashboard") && !isValid) {
    console.log("Redirecting to /otp due to invalid session for dashboard"); // <--- Add this

    return NextResponse.redirect(new URL("/otp", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
