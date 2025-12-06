"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

import Logo from "@/public/assets/images/logo.png";

const Navbar = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsNavVisible(true);
        navRef.current?.classList.remove("floating-nav");
      } else if (currentScrollY > lastScrollY + 5) {
        // Scrolling down
        setIsNavVisible(false);
        navRef.current?.classList.add("floating-nav");
      } else if (currentScrollY < lastScrollY - 5) {
        // Scrolling up
        setIsNavVisible(true);
        navRef.current?.classList.add("floating-nav");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Animate navbar visibility
  useEffect(() => {
    if (navRef.current) {
      navRef.current.style.transform = isNavVisible
        ? "translateY(0)"
        : "translateY(-100%)";
      navRef.current.style.opacity = isNavVisible ? "1" : "0";
      navRef.current.style.transition =
        "transform 0.5s ease, opacity 0.5s ease";
    }
  }, [isNavVisible]);

  const NavData = [
    { id: "home", label: "Home" },
    { id: "skills", label: "Skills" },
    { id: "project", label: "Projects" },
    { id: "certifications", label: "Certifications" },
    { id: "connect", label: "Contact" },
  ];

  return (
    <div
      ref={navRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
      style={{ transition: "transform 0.5s ease, opacity 0.5s ease" }}
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between px-5">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img
              src={Logo.src}
              alt="logo"
              className="h-10 w-auto max-w-[120px] object-contain"
            />
          </div>

          {/* Navigation Links */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {NavData.map((item, index) => (
                <Link
                  key={index}
                  href={`#${item.id}`}
                  className="nav-hover-btn no-underline text-[25px]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
