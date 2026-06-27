"use client";

import { useCallback, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import BlurText from "../misc/BlurText";
import ShinyText from "../misc/ShinyText";
import { ExperienceData } from "@/PortfolioData";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const sparkleFired = useRef<boolean[]>([]);

  const triggerSparkle = useCallback((dot: HTMLDivElement) => {
    gsap.timeline()
      .to(dot, {
        scale: 1.6,
        boxShadow: "0 0 20px rgba(168,85,247,0.8), 0 0 40px rgba(168,85,247,0.4)",
        duration: 0.08,
        ease: "power2.out",
      })
      .to(dot, {
        scale: 1,
        boxShadow: "0 0 8px rgba(168,85,247,0.3)",
        duration: 0.25,
        ease: "power2.in",
      });
  }, []);

  useEffect(() => {
    if (!lineFillRef.current || !sectionRef.current) return;

    const section = sectionRef.current;
    sparkleFired.current = new Array(dotsRef.current.length).fill(false);

    const ctx = gsap.context(() => {
      const lineST = ScrollTrigger.create({
        trigger: section,
        start: "top 60%",
        end: "bottom 30%",
        scrub: 1,
        once: true,
        onUpdate: (self) => {
          const progress = self.progress;
          gsap.set(lineFillRef.current, { scaleY: progress, transformOrigin: "top center" });

          const sectionRect = section.getBoundingClientRect();
          const lineBottom = sectionRect.top + progress * sectionRect.height;

          dotsRef.current.forEach((dot, i) => {
            if (!dot) return;
            const dotRect = dot.getBoundingClientRect();
            const dotCenterY = dotRect.top + dotRect.height / 2;

            const distToLine = lineBottom - dotCenterY;
            const approachZone = sectionRect.height * 0.2;

            if (distToLine > -approachZone && distToLine < approachZone) {
              const brightness = gsap.utils.clamp(0, 1, (distToLine + approachZone) / (approachZone * 2));
              const r = Math.round(38 + (168 - 38) * brightness);
              const scale = 1 + 0.4 * brightness;
              gsap.set(dot, {
                backgroundColor: `rgb(${r}, ${85 * brightness}, ${247 * brightness})`,
                scale,
              });
            }

            if (!sparkleFired.current[i] && distToLine >= 0) {
              sparkleFired.current[i] = true;
              triggerSparkle(dot);
            }
          });
        },
      });

      cardsRef.current.forEach((card) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { opacity: 0, x: 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }, section);

    return () => ctx.revert();
  }, [triggerSparkle]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full py-24"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-[32px] md:text-[50px] font-bold text-center mb-4">
          <BlurText
            text="Experience"
            delay={250}
            animateBy="words"
            direction="top"
            className="!text-[32px] md:!text-[50px] font-bold text-center"
          />
        </div>

        <div className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] mb-16">
          <ShinyText
            text="My professional journey and the companies I've worked with"
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </div>

        <div className="relative">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-full bg-neutral-800 rounded-full" />

          <div
            ref={lineFillRef}
            className="absolute left-1/2 -translate-x-1/2 top-0 w-0.5 h-full bg-gradient-to-b from-purple-500 to-purple-400 rounded-full origin-top scale-y-0"
          />

          <div className="relative space-y-24">
            {ExperienceData.map((job, i) => (
              <div
                key={i}
                className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                  i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div
                  ref={(el) => { if (el) cardsRef.current[i] = el; }}
                  className="w-full md:w-[calc(50%-2rem)] bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-colors duration-300"
                >
                  <span className="text-purple-400 text-sm font-medium tracking-wide uppercase">
                    {job.date}
                  </span>
                  <h3 className="text-white text-xl font-bold mt-1">
                    {job.title}
                  </h3>
                  <p className="text-gray-400 text-sm font-medium mt-0.5">
                    {job.company}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed mt-3">
                    {job.description}
                  </p>
                </div>

                <div
                  ref={(el) => { if (el) dotsRef.current[i] = el; }}
                  className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-neutral-800 border-2 border-[#121212] z-10 hidden md:block"
                />

                <div className="hidden md:block w-[calc(50%-2rem)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
