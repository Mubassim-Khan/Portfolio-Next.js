"use client";

import { useState } from "react";

type FlightButtonProps = {
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export function FlightButton({ type = "submit", disabled, className = "" }: FlightButtonProps) {
  const [isFlying, setIsFlying] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    setIsFlying(true);
    setTimeout(() => setIsFlying(false), 1000);
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`group relative overflow-hidden ${className} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <span className="relative z-10 flex items-center gap-1.5">
        <span>Send Message</span>
        <svg
          viewBox="0 0 24 24"
          className={`w-3.5 h-3.5 transition-all duration-500 ${
            isFlying ? "translate-x-8 -translate-y-8 opacity-0" : "translate-x-0 translate-y-0 opacity-100"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </span>
    </button>
  );
}
