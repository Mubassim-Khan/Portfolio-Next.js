"use client";

import { ReactNode } from "react";

type SoftPillButtonProps = {
  as?: "button" | "span" | "a";
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
};

export default function SoftPillButton({
  as: Tag = "button",
  variant = "primary",
  children,
  className = "",
  ...props
}: SoftPillButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full text-[13px] font-medium transition-all duration-300 cursor-pointer";

  const variantStyles = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
    secondary:
      "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700",
  };

  const combined = `${baseStyles} ${variantStyles[variant]} ${className}`;

  if (Tag === "a") {
    return (
      <a className={`${combined} group`} {...(props as any)}>
        {children}
      </a>
    );
  }

  if (Tag === "span") {
    return <span className={combined}>{children}</span>;
  }

  return (
    <button type="button" className={`${combined} group`} {...(props as any)}>
      {children}
    </button>
  );
}
