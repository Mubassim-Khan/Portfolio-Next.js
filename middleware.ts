import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "@/lib/auth/validateSession";

export function middleware(req: NextRequest) {
  const sessionStr = req.cookies.get("session")?.value;

  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!isSessionValid(sessionStr)) {
      return NextResponse.redirect(new URL("/otp", req.url));
    }

    try {
      const decoded = decodeURIComponent(sessionStr!);
      const session = JSON.parse(decoded);

      session.lastActive = Date.now();
      const encoded = encodeURIComponent(JSON.stringify(session));

      const res = NextResponse.next();
      res.cookies.set("session", encoded, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12, // 12 hours
      });
      return res;
    } catch {
      return NextResponse.redirect(new URL("/otp", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
