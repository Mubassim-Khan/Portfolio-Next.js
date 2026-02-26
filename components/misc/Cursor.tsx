"use client";

import { useEffect } from "react";

import Cursor from "@/public/assets/images/cursor.png";
import CursorPointer from "@/public/assets/images/cursor-pointer.png";

const CustomCursor = () => {
  useEffect(() => {
    const cursor = document.querySelector(".cursor") as HTMLDivElement | null;
    const trail = document.querySelector(
      ".cursor-trail"
    ) as HTMLDivElement | null;

    const hoverElements = document.querySelectorAll(
      "button, a, .cursor--pointer"
    );

    // Preload both images once to cache them
    const preloadImages = () => {
      const normalCursorImg = new Image();
      normalCursorImg.src = Cursor.src;
      const pointerCursorImg = new Image();
      pointerCursorImg.src = CursorPointer.src;
    };
    preloadImages();

    const isMobileView = (): boolean => {
      return window.innerWidth <= 750 || "ontouchstart" in window;
    };

    const updateCursorDisplay = () => {
      const display = isMobileView() ? "none" : "flex";
      if (cursor) cursor.style.display = display;
      if (trail) trail.style.display = display;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cursor) {
        cursor.style.transform = `translate(${x}px, ${y}px)`;
      }
      if (trail) {
        setTimeout(() => {
          trail.style.transform = `translate(${x}px, ${y}px)`;
        }, 50);
      }
    };

    updateCursorDisplay();

    if (!isMobileView()) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("resize", updateCursorDisplay);

    // Use event delegation instead of attaching to specific elements
    // This handles both existing and dynamically added elements
    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "BUTTON" ||
        target?.tagName === "A" ||
        target?.classList?.contains("cursor--pointer")
      ) {
        const normalImg = cursor?.querySelector(
          ".cursor-normal"
        ) as HTMLImageElement | null;
        const pointerImg = cursor?.querySelector(
          ".cursor-pointer-img"
        ) as HTMLImageElement | null;

        if (normalImg) normalImg.style.opacity = "0";
        if (pointerImg) pointerImg.style.opacity = "1";
      }
    };

    const handleMouseLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.tagName === "BUTTON" ||
        target?.tagName === "A" ||
        target?.classList?.contains("cursor--pointer")
      ) {
        const normalImg = cursor?.querySelector(
          ".cursor-normal"
        ) as HTMLImageElement | null;
        const pointerImg = cursor?.querySelector(
          ".cursor-pointer-img"
        ) as HTMLImageElement | null;

        if (normalImg) normalImg.style.opacity = "1";
        if (pointerImg) pointerImg.style.opacity = "0";
      }
    };

    document.addEventListener("mouseenter", handleMouseEnter, true);
    document.addEventListener("mouseleave", handleMouseLeave, true);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter, true);
      document.removeEventListener("mouseleave", handleMouseLeave, true);
      window.removeEventListener("resize", updateCursorDisplay);
    };
  }, []);

  return (
    <>
      <div className="cursor z-[99999] pointer-events-none">
        <img
          className="cursor-normal"
          src={Cursor.src}
          alt="cursor"
          width={32}
          height={32}
          draggable={false}
          style={{ opacity: 1, transition: "opacity 0.15s ease-in-out" }}
        />
        <img
          className="cursor-pointer-img"
          src={CursorPointer.src}
          alt="cursor-pointer"
          width={32}
          height={32}
          draggable={false}
          style={{ opacity: 0, transition: "opacity 0.15s ease-in-out", position: "absolute" }}
        />
      </div>
      <div className="cursor-trail"></div>
    </>
  );
};

export default CustomCursor;