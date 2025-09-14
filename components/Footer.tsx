import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SocialLinks } from "@/PortfolioData";
import Logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="footer py-6 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center md:justify-between">
          {/* Logo */}
          <div className="w-full sm:w-1/2 flex justify-center md:justify-start mb-4 sm:mb-0">
            <div className="w-28 h-auto">
              {" "}
              {/* fixed width for logo */}
              <Image
                src={Logo}
                alt="Logo"
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Social icons + text */}
          <div className="w-full sm:w-1/2 text-center sm:text-right">
            <div className="flex justify-center sm:justify-end space-x-4 mb-2">
              <TooltipProvider delayDuration={150}>
                {SocialLinks.slice(0, 4).map((link, id) => (
                  <Tooltip key={id}>
                    <TooltipTrigger asChild>
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="cursor-pointer hover:opacity-80 transition"
                      >
                        <div className="w-8 h-8 flex items-center justify-center">
                          <Image
                            src={link.icon}
                            alt={link.alt}
                            width={25}
                            height={25}
                            className="object-contain hover:scale-110 transition-transform"
                          />
                        </div>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent
                      className="rounded-xl bg-gray-900 text-white mb-2"
                      side="top"
                      align="center"
                    >
                      <p>{link.username}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <p className="text-sm text-gray-400">© 2025. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
