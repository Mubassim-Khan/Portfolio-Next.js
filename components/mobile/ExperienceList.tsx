"use client";

import { ExperienceData } from "@/PortfolioData";

export function ExperienceList() {
  return (
    <div className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
      {ExperienceData.map((item, idx) => (
        <div key={idx} className="flex items-start gap-3 py-3">
          <div className="size-9 shrink-0 rounded-[8px] border border-black/10 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] p-[2px] shadow-sm overflow-hidden flex items-center justify-center">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase">
              {item.company.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate">
              {item.title}
            </h3>
            <p className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate">
              {item.company}
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
              {item.date}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
