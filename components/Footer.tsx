import React from "react";
import Link from "next/link";
import Image from "next/image";

import { SocialLinks } from "@/PortfolioData";
import Logo from "@/assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="footer py-6 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center md:justify-between">
          {/* Logo */}
          <div className="w-full sm:w-1/2 flex justify-center md:justify-start mb-4 sm:mb-0">
            <Image
              src={Logo}
              alt="Logo"
              className="w-1/4"
              priority
            />
          </div>

          {/* Social icons + text */}
          <div className="w-full sm:w-1/2 text-center sm:text-right">
            <div className="flex justify-center sm:justify-end space-x-4 mb-2">
              {SocialLinks.slice(0, 4).map((link, id) => (
                <Link
                  key={id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer hover:opacity-80 transition"
                >
                  <Image
                    src={link.icon}
                    alt={link.alt}
                    width={24}
                    height={24}
                  />
                </Link>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              © 2025. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
