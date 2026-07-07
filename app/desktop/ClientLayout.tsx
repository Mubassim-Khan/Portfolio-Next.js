"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

import { ToasterProvider } from "@/components/desktop/providers/ToastProvider";
import Navbar from "@/components/desktop/layout/Navbar";
import Footer from "@/components/desktop/layout/Footer";
import Cursor from "@/components/desktop/misc/Cursor";
import Particles from "@/components/desktop/misc/Particles";

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

  const hideLayout = pathname.startsWith("/dashboard") || pathname === "/otp";

  return (
    <ToasterProvider>
      <Cursor />
      {!hideLayout && <Navbar />}
      <div className="relative z-20">
        {children}
        {!hideLayout && <Footer />}
      </div>
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
    </ToasterProvider>
  );
}
