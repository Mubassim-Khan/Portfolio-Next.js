import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/mobile/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import LenisScroll from "@/components/shared/LenisScroll";
import PWAInstall from "@/components/shared/PWAInstall";
import VisitorTracker from "@/components/shared/VisitorTracker";
import Script from "next/script";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mubassim Ahmed Khan",
  description:
    "Full stack developer building clean, modern websites and apps with a focus on design, functionality, and attention to detail.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: { capable: true, title: "Mubassim", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#121212",
};

export default function MobileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col dark:bg-black dark:text-zinc-50 transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LenisScroll />
          <Toaster position="top-center" toastOptions={{ style: { background: "#fff", color: "#000" } }} />
          {children}
          <PWAInstall />
          <VisitorTracker />
        </ThemeProvider>
        <Script data-goatcounter="https://mubassim.goatcounter.com/count" async src="//gc.zgo.at/count.js" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
