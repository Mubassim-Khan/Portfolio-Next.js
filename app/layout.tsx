import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import 'bootstrap/dist/css/bootstrap.min.css';

import ClientLayout from "./ClientLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mubassim Ahmed Khan | Personal Portfolio",
  description: "Portfolio of Mubassim Ahmed Khan – showcasing MERN projects, certifications, skills in AI, and web development expertise.",
  keywords: [
    "Mubassim Ahmed Khan",
    "MERN Developer",
    "Full Stack Developer",
    "Portfolio",
    "JavaScript",
    "React",
    "Node.js",
    "MongoDB",
    "GenAI",
    "Web Development",
    "Next.js",
  ],
  authors: [{ name: "Mubassim Ahmed Khan", url: "https://mubassim.vercel.app" }],
  creator: "Mubassim Ahmed Khan",
  metadataBase: new URL("https://mubassim.vercel.app"),
  openGraph: {
    title: "Mubassim Ahmed Khan | MERN Stack Developer",
    description: "Explore projects, certifications, and skills of Mubassim – a full-stack developer & GenAI enthusiast.",
    url: "https://mubassim.vercel.app",
    siteName: "Mubassim's Portfolio",
    images: [
      {
        url: "@/assets/images/preview.png",
        width: 1200,
        height: 630,
        alt: "Mubassim Ahmed Khan Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
