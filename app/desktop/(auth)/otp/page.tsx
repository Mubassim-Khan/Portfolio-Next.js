"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ShinyText from "@/components/desktop/misc/ShinyText";
import CodeSlots, { type CodeSlotsStatus } from "@/components/CodeSlots";
import Link from "next/link";

const OTPPage = () => {
  const resendStorageKey = "portfolio-otp-resend-until";
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [resendUntil, setResendUntil] = useState<number | null>(null);
  const [timerReady, setTimerReady] = useState(false);
  const [status, setStatus] = useState<CodeSlotsStatus>("idle");
  const [isVerifying, setIsVerifying] = useState(false);
  const isSendingRef = useRef(false);
  const redirectTimerRef = useRef<number | null>(null);
  const router = useRouter();

  // Derive the countdown from an absolute time so it remains correct after a
  // refresh, suspended tab, or a slow device clock tick.
  useEffect(() => {
    if (!resendUntil) return;

    const updateCountdown = () => {
      const seconds = Math.max(0, Math.ceil((resendUntil - Date.now()) / 1000));
      setCountdown(seconds);
      if (seconds === 0) {
        sessionStorage.removeItem(resendStorageKey);
        setResendUntil(null);
      }
    };

    updateCountdown();
    const interval = window.setInterval(updateCountdown, 500);
    return () => window.clearInterval(interval);
  }, [resendUntil]);

  // Function to send OTP
  const sendOTP = async () => {
    if (isSendingRef.current) return;
    isSendingRef.current = true;

    // Reserve the resend window before the request. A reload while the email
    // request is pending must not result in another OTP being generated.
    const expiresAt = Date.now() + 59_000;
    sessionStorage.setItem(resendStorageKey, String(expiresAt));
    setResendUntil(expiresAt);

    try {
      await toast.promise(
        (async () => {
          const res = await fetch("/api/send-otp", { method: "POST" });
          const data = await res.json();
          if (!data.success) throw new Error(data.message || "Failed to generate OTP");
        })(),
        {
          loading: "Sending OTP...",
          success: "OTP sent to your email",
          error: (err) => err.message || "Failed to send OTP",
        },
      );
    } catch {
      sessionStorage.removeItem(resendStorageKey);
      setResendUntil(null);
    } finally {
      isSendingRef.current = false;
    }
  };

  // Send only on the first visit in this browser session. Reloads restore the
  // saved expiry instead of calling the endpoint again.
  useEffect(() => {
    const savedExpiry = Number(sessionStorage.getItem(resendStorageKey));
    if (savedExpiry > Date.now()) {
      setResendUntil(savedExpiry);
    } else {
      sessionStorage.removeItem(resendStorageKey);
      void sendOTP();
    }
    setTimerReady(true);
  }, []);

  const verifyOTP = async (code: string) => {
    if (isVerifying) return;
    setIsVerifying(true);

    try {
      await toast.promise(
        (async () => {
          const res = await fetch("/api/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp: code }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "Invalid OTP");
          return data;
        })(),
        {
          loading: "Validating...",
          success: "OTP Verified!",
          error: (err) => err.message || "Invalid OTP",
        },
      );

      setStatus("success");
      // Leave enough time for Code Slots' accept animation to be visible.
      redirectTimerRef.current = window.setTimeout(() => {
        router.replace("/dashboard");
        router.refresh();
      }, 650);
    } catch {
      setStatus("error");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(
    () => () => {
      if (redirectTimerRef.current !== null) {
        window.clearTimeout(redirectTimerRef.current);
      }
    },
    [],
  );

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <div className="flex flex-col pt-5 mb-5 mt-[-5rem] text-[35px] font-medium text-center">
          <ShinyText
            text="Way more than just Portfolio"
            disabled={false}
            speed={3}
          />
          <ShinyText
            text="Enter world beyond your imagination"
            disabled={false}
            speed={3}
          />
        </div>

        <div className="text-center mt-3">
          <h1 className="text-[35px] font-semibold mb-2">Enter OTP</h1>
          <p className="text-gray-500 text-xl mb-6 text-center mt-3">
            Please enter the OTP sent to your registered email.
          </p>
        </div>

        <CodeSlots
          length={6}
          value={otp}
          status={status}
          onChange={(code) => {
            setOtp(code);
            if (status !== "idle") setStatus("idle");
          }}
          onComplete={verifyOTP}
          accentColor="#f5f5f5"
          inkColor="#f5f5f5"
          slotColor="#27272a"
          digitColor="#18181b"
          dangerColor="#ff3b30"
          slotSize={44}
          gap={8}
          radius={12}
          bounce={0.2}
          settle={0.3}
          rise={8}
          cascade={20}
          mask={false}
          caret
          autoFocus
          disabled={isVerifying || status === "success"}
        />

        <div className="mt-4 text-center text-gray-500">
          Didn&apos;t receive email?
          {!timerReady || resendUntil ? (
            <span>Try again in {countdown}s</span>
          ) : (
            <button
              onClick={sendOTP}
              className="text-blue-500 hover:underline disabled:opacity-50 ml-1"
            >
              Click here to resend
            </button>
          )}
        </div>

        <p className="text-gray-500 text-lg text-center mt-3">
          If you were not meant to be here, you can take a step back to
          <Link
            href="/"
            className="text-blue-500 hover:underline no-underline disabled:opacity-50 ml-1"
          >
            Portfolio
          </Link>
        </p>

        <div className="flex flex-col pt-5 mb-5 mt-1 text-[30px] font-medium text-center">
          <ShinyText
            text="Can't Rush Greatness..."
            disabled={false}
            speed={3}
          />
        </div>
      </div>
    </main>
  );
};

export default OTPPage;
