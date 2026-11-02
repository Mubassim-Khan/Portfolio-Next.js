"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "pwa-install-dismissed";

export default function PWAInstall() {
  const pathname = usePathname();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    try {
      setDismissed(sessionStorage.getItem(DISMISS_KEY) === "1");
    } catch {
      setDismissed(false);
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const ua = navigator.userAgent;
    if (/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua)) setShowIosHint(true);

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setDeferred(null);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const hidden = pathname.startsWith("/dashboard") || pathname === "/otp";
  if (hidden || dismissed || (!deferred && !showIosHint)) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "1");
    } catch {}
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    dismiss();
  };

  return (
    <div className="fixed inset-x-4 bottom-4 z-[200] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-[#121212]/95 p-3 text-white shadow-2xl backdrop-blur-xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/icons/icon-192.png" alt="" width={44} height={50} className="h-15 w-11 shrink-0 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight">Install Mubassim&apos;s Portfolio</p>
        <p className="mt-0.5 text-xs text-zinc-400">
          {deferred ? "Add it to your home screen for quick access." : "Tap Share, then Add to Home Screen."}
        </p>
      </div>
      {deferred && (
        <button
          onClick={install}
          className="flex shrink-0 items-center gap-1.5 bg-white rounded-xl px-3 py-1.5 text-xs font-semibold text-black"
        >
          <Download size={14} /> Install
        </button>
      )}
      <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 text-zinc-400 hover:text-white">
        <X size={16} />
      </button>
    </div>
  );
}
