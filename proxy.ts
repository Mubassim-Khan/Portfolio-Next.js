import { NextRequest, NextResponse } from "next/server";
import { isSessionValid } from "@/lib/auth/validateSession";

function isMobileDevice(ua: string): boolean {
  return /mobile|android|iphone|ipad|ipod/i.test(ua);
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionStr = req.cookies.get("session")?.value;

  // ── 1. Dashboard auth guard ─────────────────────────────────────────────────
  if (pathname.startsWith("/dashboard")) {
    if (!isSessionValid(sessionStr)) {
      return NextResponse.redirect(new URL("/otp", req.url));
    }

    try {
      const decoded = decodeURIComponent(sessionStr!);
      const session = JSON.parse(decoded);

      session.lastActive = Date.now();
      const encoded = encodeURIComponent(JSON.stringify(session));

      const target = pathname.replace("/dashboard", "/desktop/dashboard");
      const res = NextResponse.rewrite(new URL(target, req.url));
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

  // ── 2. Mobile / desktop routing ────────────────────────────────────────────
  if (pathname === "/") {
    const ua = req.headers.get("user-agent") ?? "";
    const target = isMobileDevice(ua) ? "/mobile" : "/desktop";
    return NextResponse.rewrite(new URL(target, req.url));
  }

  // Rewrite /otp to desktop otp page
  if (pathname === "/otp") {
    return NextResponse.rewrite(new URL("/desktop/otp", req.url));
  }

  // Rewrite /contact, /experience, /projects, /resume to mobile versions
  if (["/contact", "/experience", "/projects", "/resume", "/pull-requests"].includes(pathname)) {
    return NextResponse.rewrite(new URL(`/mobile${pathname}`, req.url));
  }

  // Rewrite /projects/[slug] to mobile
  if (pathname.startsWith("/projects/")) {
    return NextResponse.rewrite(new URL(`/mobile${pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/",
    "/otp",
    "/contact",
    "/experience",
    "/projects",
    "/projects/:path*",
    "/resume",
    "/pull-requests",
  ],
};