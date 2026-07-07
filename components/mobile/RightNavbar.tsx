"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", icon: "H" },
  { label: "Experience", href: "/experience", icon: "E" },
  { label: "Projects", href: "/projects", icon: "P" },
  { label: "Contact", href: "/contact", icon: "C" },
];

export function RightNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center justify-center w-7 h-7 rounded-full border transition-all duration-200 ${
              isActive
                ? "border-zinc-400 dark:border-zinc-500 bg-zinc-100 dark:bg-zinc-800"
                : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
            }`}
            aria-label={item.label}
          >
            <span className={`text-[10px] font-bold ${
              isActive
                ? "text-zinc-800 dark:text-zinc-200"
                : "text-zinc-400 dark:text-zinc-500"
            }`}>
              {item.icon}
            </span>
            <span className="absolute right-full mr-3 whitespace-nowrap text-[11px] text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
