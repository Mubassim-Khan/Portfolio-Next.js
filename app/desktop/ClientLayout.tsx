"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { ToasterProvider } from "@/components/desktop/providers/ToastProvider";
import Navbar from "@/components/desktop/layout/Navbar";
import Footer from "@/components/desktop/layout/Footer";
import Cursor from "@/components/desktop/misc/Cursor";
import Particles from "@/components/desktop/misc/Particles";
import LenisScroll from "@/components/shared/LenisScroll";
import PWAInstall from "@/components/shared/PWAInstall";
import VisitorTracker from "@/components/shared/VisitorTracker";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "m") {
        router.push("/dashboard");
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const hideLayout = isDashboardRoute || pathname === "/otp";
  const isOtpPage = pathname === "/otp";
  const enablePortfolioEffects = !isDashboardRoute && !isOtpPage;

  return (
    <ToasterProvider>
      {enablePortfolioEffects && <LenisScroll />}
      <PWAInstall />
      <VisitorTracker />
      <Cursor />
      {!hideLayout && <Navbar />}
      <div className="relative z-20">
        {children}
        {!hideLayout && <Footer />}
      </div>
      {enablePortfolioEffects && (
        <div className="fixed inset-0 pointer-events-none z-10">
          <Particles
            particleColors={["#ffffff"]}
            particleCount={150}
            particleSpread={8}
            speed={0.05}
            particleBaseSize={80}
            moveParticlesOnHover={false}
            alphaParticles
            disableRotation={false}
            pixelRatio={1}
          />
        </div>
      )}
    </ToasterProvider>
  );
}
