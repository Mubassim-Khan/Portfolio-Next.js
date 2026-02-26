"use client";

import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FileUser } from "lucide-react";

export default function FloatingButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href="/assets/docs/Mubassim_Khan_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="
              fixed bottom-6 right-6 z-50
              w-12 h-12
              flex items-center justify-center
              rounded-full
              backdrop-blur-xl bg-white/10 border border-white/20
              shadow-[0_0_20px_rgba(255,255,255,0.15)]
              hover:bg-white/20 hover:scale-110
              transition-all duration-300
            "
          >
            <FileUser className="w-6 h-6 text-white" />
          </Link>
        </TooltipTrigger>

        <TooltipContent
          side="top"
          align="center"
          className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white"
        >
          Resume
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
