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

    const preloadImages = () => {
      const normalCursorImg = new Image();
      normalCursorImg.src = Cursor.src;

      const pointerCursorImg = new Image();
      pointerCursorImg.src = CursorPointer.src;
    };

    preloadImages();

    const isMobileView = () =>
      window.innerWidth <= 750 || "ontouchstart" in window;

    const updateCursorDisplay = () => {
      const display = isMobileView() ? "none" : "flex";
      if (cursor) cursor.style.display = display;
      if (trail) trail.style.display = display;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      if (cursor) cursor.style.transform = `translate(${x}px, ${y}px)`;
      if (trail)
        setTimeout(() => {
          trail.style.transform = `translate(${x}px, ${y}px)`;
        }, 50);
    };

    updateCursorDisplay();

    if (!isMobileView()) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    window.addEventListener("resize", updateCursorDisplay);

    // --- SWAP CACHED IMAGE OBJECTS ---
    hoverElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const normalImg = cursor?.querySelector(
          ".cursor-normal"
        ) as HTMLImageElement | null;
        const pointerImg = cursor?.querySelector(
          ".cursor-pointer"
        ) as HTMLImageElement | null;

        if (normalImg) normalImg.style.opacity = "0";
        if (pointerImg) pointerImg.style.opacity = "1";
      });

      el.addEventListener("mouseleave", () => {
        const normalImg = cursor?.querySelector(
          ".cursor-normal"
        ) as HTMLImageElement | null;
        const pointerImg = cursor?.querySelector(
          ".cursor-pointer"
        ) as HTMLImageElement | null;

        if (normalImg) normalImg.style.opacity = "1";
        if (pointerImg) pointerImg.style.opacity = "0";
      });
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", updateCursorDisplay);
    };
  }, []);

  return (
    <>
      <div className="cursor z-[99999] pointer-events-none">
        <img
          src={Cursor.src}
          alt="cursor"
          width={32}
          height={32}
          draggable={false}
        />
      </div>
      <div className="cursor-trail"></div>
    </>
  );
};

export default CustomCursor;
