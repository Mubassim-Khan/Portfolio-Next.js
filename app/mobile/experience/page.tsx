"use client";

import { ThemeToggle } from "@/components/mobile/theme-toggle";
import { CommandMenu } from "@/components/mobile/command-menu";
import { CurrentTime } from "@/components/mobile/CurrentTime";
import { RightNavbar } from "@/components/mobile/RightNavbar";
import { FooterBackground } from "@/components/mobile/FooterBackground";
import { ExperienceData } from "@/PortfolioData";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function AllExperiencePage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black relative overflow-x-hidden transition-colors duration-300">
      <RightNavbar />

      <div className="absolute top-0 bottom-0 left-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute top-0 bottom-0 right-[30%] w-0 border-r border-black/30 dark:border-white/[0.15] pointer-events-none hidden md:block" style={{ maskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to bottom, black 0, black 1px, transparent 1px, transparent 6px)' }} />

      <div className="absolute left-0 right-0 top-[22vh] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
      <div className="absolute left-0 right-0 top-[calc(22vh+112px)] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />

      {[
        { top: '22vh', left: '30%' },
        { top: '22vh', right: '30%' },
        { top: 'calc(22vh + 112px)', left: '30%' },
        { top: 'calc(22vh + 112px)', right: '30%' },
      ].map((pos, i) => (
        <div key={i} className="absolute w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] pointer-events-none z-10 hidden md:block"
          style={{
            top: pos.top,
            left: pos.left,
            right: pos.right,
            transform: `translate(${pos.right ? '50%' : '-50%'}, -50%)`
          }} />
      ))}

      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-0 h-[22vh] -z-0 pointer-events-auto">
        <FooterBackground />
        <div className="absolute bottom-3 right-2 z-10 pointer-events-auto">
          <CurrentTime />
        </div>
      </div>

      <div className="absolute left-0 right-0 md:left-[30%] md:right-[30%] top-[22vh] h-[112px] flex items-center px-4 z-50">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/"
              className="group flex items-center justify-center w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </Link>
            <div className="flex flex-col justify-center">
              <h1 className="text-[20px] sm:text-[24px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight leading-none mb-0.5 [text-shadow:-1.5px_0_0_rgba(0,200,255,0.3),1.5px_0_0_rgba(255,80,0,0.3)] dark:[text-shadow:-1.5px_0_0_rgba(0,200,255,0.6),1.5px_0_0_rgba(255,80,0,0.6)]">
                All Experiences
              </h1>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400">
                Full Experience Archive
              </p>
            </div>
          </div>

          <div className="flex items-start justify-end gap-2 sm:gap-3 h-20 sm:h-24 py-1">
            <CommandMenu />
            <ThemeToggle className="dark:text-zinc-400 hover:dark:text-zinc-300" />
          </div>
        </div>
      </div>

      <div className="ml-0 mr-0 md:ml-[30%] md:mr-[30%] pt-[calc(22vh+112px)] pb-16 px-4 flex flex-col z-10 relative">
        <div className="relative pt-0 pb-6">
          <div className="flex flex-col relative z-10 w-full">
            {ExperienceData.map((item, idx) => {
              const isOpen = openIdx === idx;
              const isLast = idx === ExperienceData.length - 1;

              return (
                <div key={idx} className="group relative">
                  <div
                    className={`absolute bottom-0 ${isLast ? 'left-[-100vw] right-[-100vw]' : 'left-[-16px] right-[-16px]'} h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none z-10`}
                    style={{
                      maskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                      WebkitMaskImage: "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
                    }}
                  />
                  {isLast && (
                    <>
                      <div className="absolute bottom-0 -left-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] -translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                      <div className="absolute bottom-0 -right-4 w-[2px] h-[2px] bg-black/40 dark:bg-white/[0.25] translate-x-1/2 translate-y-1/2 pointer-events-none z-20" />
                    </>
                  )}

                  <div
                    className="flex flex-col items-start gap-2.5 py-3.5 px-4 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/20 transition-colors cursor-pointer relative z-20 rounded-lg sm:gap-3 sm:py-4 2xl:flex-row 2xl:items-center 2xl:justify-between"
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                  >
                    <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
                      <div className="size-10 shrink-0 rounded-[10px] border border-black/10 bg-zinc-50 dark:border-zinc-800 dark:bg-[#111111] p-[2px] shadow-sm shadow-black/15 dark:shadow-md dark:shadow-black/50 flex items-center justify-center">
                        <span className="text-[12px] font-bold text-zinc-400 dark:text-zinc-500">
                          {item.company.charAt(0)}
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-col gap-0.5 pr-2 sm:pr-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[14px] font-bold leading-tight text-zinc-900 dark:text-zinc-100 sm:text-[17px]">
                            {item.title}
                          </span>
                        </div>
                        <span className="truncate text-[14px] text-zinc-600 dark:text-zinc-400 sm:text-[15px]">
                          {item.company}
                        </span>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-start gap-0.5 pr-5 pl-[52px] text-left sm:pl-[56px] 2xl:items-end 2xl:pl-0 2xl:text-right">
                      <div className="relative flex items-center text-[13px] font-medium text-zinc-900 dark:text-zinc-100 sm:text-[14px]">
                        <span>{item.date}</span>
                        <svg
                          viewBox="0 0 24 24"
                          className={`w-3.5 h-3.5 text-zinc-500 absolute -right-5 top-1/2 -translate-y-1/2 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                        >
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`-mx-4 grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <div
                        className={`${isOpen ? "pb-4 pt-0 opacity-100 translate-y-0" : "pb-0 pt-0 opacity-0 -translate-y-2"} transition-all duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] pl-6 pr-8 text-[14px] text-zinc-600 dark:text-zinc-400`}
                      >
                        <p className="leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative mt-8">
          <div className="absolute left-[-100vw] right-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15] pointer-events-none" style={{ maskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)', WebkitMaskImage: 'repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)' }} />
          <div className="absolute -left-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] -translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
          <div className="absolute -right-4 w-[2px] h-[2px] bg-black/50 dark:bg-white/[0.25] translate-x-1/2 translate-y-[-1px] pointer-events-none z-20" />
        </div>
      </div>
    </div>
  );
}
