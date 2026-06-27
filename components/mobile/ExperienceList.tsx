"use client";

import Image from "next/image";

const experiences = [
  {
    title: "Linux Foundation AI Security Mentorship",
    role: "AI Security Intern, Caracal",
    dates: "Jun 2026 - Present",
    src: "/Experience-image/lf-decentralized-trust.png",
  },
  {
    title: "Google Summer of Code 2026",
    role: "AI Intern, Sugar Labs",
    dates: "May 2026 - Present",
    src: "/Experience-image/Google_Summer_of_Code_sun_logo_2022.svg (1).png",
  },
  {
    title: "Vercel OSS Program x VengenceUI",
    role: "Founder & Maintainer",
    dates: "Oct 2025 - Present",
    src: "/Experience-image/vercel-symbol-colored-light.png",
  },
  {
    title: "Open Source Contributor",
    role: "Sugar Labs, Joplin, kgateway & more",
    dates: "Sep 2025 - Apr 2026",
    src: "/Experience-image/pngegg (1).png",
  },
];

export function ExperienceList() {
  return (
    <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
      {experiences.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 py-3">
          <div className="size-9 shrink-0 rounded-[8px] border border-black/10 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] p-[2px] shadow-sm overflow-hidden">
            <div className="w-full h-full rounded-[6px] border border-black/5 dark:border-black/20 bg-white flex items-center justify-center overflow-hidden">
              <Image
                src={item.src}
                alt={item.title}
                width={36}
                height={36}
                sizes="36px"
                quality={50}
                className="object-contain w-full h-full p-0.5"
              />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {item.title}
            </h3>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate">
              {item.role}
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {item.dates}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
