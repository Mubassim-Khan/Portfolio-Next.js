"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    goatcounter?: { count?: (vars: { path: string; title?: string; event?: boolean }) => void };
  }
}

const RETURNING_KEY = "visited-before";
const SESSION_KEY = "visit-tracked";

/**
 * GoatCounter is cookieless, so it cannot tell new and returning people apart.
 * This records one "new-visitor" or "returning-visitor" event per browsing session,
 * using a localStorage flag, so the monthly report can show the split.
 */
export default function VisitorTracker() {
  const pathname = usePathname();
  const skip = pathname.startsWith("/dashboard") || pathname === "/otp";

  useEffect(() => {
    if (skip) return;

    let returning = false;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      returning = localStorage.getItem(RETURNING_KEY) === "1";
    } catch {
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      const count = window.goatcounter?.count;
      if (count) {
        window.clearInterval(timer);
        count({ path: returning ? "returning-visitor" : "new-visitor", title: returning ? "Returning visitor" : "New visitor", event: true });
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
          localStorage.setItem(RETURNING_KEY, "1");
        } catch {}
      } else if (attempts >= 20) {
        window.clearInterval(timer);
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, [skip]);

  return null;
}
