"use client";

import { ReactNode, useState } from "react";

type SocialHoverCardProps = {
  socialName: string;
  children: ReactNode;
};

const socialDescriptions: Record<string, string> = {
  GitHub: "Check out my open source work",
  Twitter: "Follow me for updates",
  LinkedIn: "Connect with me professionally",
  Discord: "Join my community",
};

export default function SocialHoverCard({ socialName, children }: SocialHoverCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 text-[11px] font-medium whitespace-nowrap shadow-lg z-50 pointer-events-none">
          {socialDescriptions[socialName] || socialName}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900 dark:border-t-zinc-100" />
        </div>
      )}
    </div>
  );
}
