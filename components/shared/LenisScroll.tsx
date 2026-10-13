"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Keeps native scrolling, GSAP, and Lenis on one animation clock.  It is
 * mounted once in each site shell so every route gets the same scroll feel.
 */
export default function LenisScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.12,
      touchInertiaExponent: 1.35,
      anchors: true,
      autoRaf: false,
      respectReducedMotion: true,
    });

    const updateScrollTrigger = () => ScrollTrigger.update();
    const tick = (time: number) => lenis.raf(time * 1000);

    lenis.on("scroll", updateScrollTrigger);
    gsap.ticker.add(tick);
    // A delayed GSAP tick would make scroll-linked motion visibly trail Lenis.
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
