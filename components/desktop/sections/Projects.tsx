"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import toast from "react-hot-toast";
import ProjectCard from "../cards/ProjectCard";
import ShinyText from "../misc/ShinyText";
import BlurText from "../misc/BlurText";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  name: string;
  description: string;
  url?: string;
  githubURL?: string;
  coverImage?: string;
  /** A direct .mp4/.webm URL or a YouTube embed URL, when supplied by the API. */
  videoUrl?: string;
};

const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/portfolio/projects", { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error("Unable to load projects");
        return response.json();
      })
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch((error) => {
        if (error.name !== "AbortError") toast.error("Failed to fetch projects");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !viewport || !track || projects.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      const firstCard = track.querySelector<HTMLElement>(".project-card");
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const gap = Number.parseFloat(getComputedStyle(track).gap) || 0;
      const centeredX = viewport.clientWidth / 2 - cardWidth / 2;
      const offscreenX = viewport.clientWidth + Math.min(cardWidth * 0.35, 260);
      const travel = Math.max(0, track.scrollWidth - cardWidth);
      const finalX = viewport.clientWidth * 0.08 - travel;
      const scrollLength = Math.max(window.innerHeight * 2.1, travel + cardWidth + gap);
      const cards = gsap.utils.toArray<HTMLElement>(".project-card", track);

      gsap.set(track, { x: offscreenX, y: window.innerHeight * 0.3, scale: 0.72, autoAlpha: 0 });
      gsap.set(cards, { y: 28, scale: 0.94, autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${scrollLength}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // First the rail enters diagonally; then the same scroll moves it sideways.
      timeline
        .to(track, { x: centeredX, y: 0, scale: 1, autoAlpha: 1, duration: 0.28, ease: "power3.out" })
        .to(cards, { y: 0, scale: 1, autoAlpha: 1, duration: 0.16, stagger: 0.045, ease: "power2.out" }, 0.08);

      if (projects.length > 1) {
        timeline.to(track, { x: finalX, duration: 0.72, ease: "none" });
      }

      ScrollTrigger.refresh();
    }, section);

    return () => context.revert();
  }, [projects]);

  return (
    <section ref={sectionRef} id="project" className="relative min-h-screen w-full overflow-hidden bg-[#121212]">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 mx-auto max-w-[1140px] px-4 pt-16 md:pt-20">
        <div className="text-center text-[32px] font-bold md:text-[50px]">
          <BlurText text="Projects" delay={180} animateBy="words" direction="top" className="!text-[32px] !font-bold md:!text-[50px]" />
        </div>
        <div className="mx-auto mt-3 max-w-3xl text-center text-[16px] font-medium leading-relaxed tracking-[0.6px] text-[#B8B8B8] md:text-[18px]">
          <ShinyText text="A selection of hands-on work. Scroll to bring a project into focus, then travel through the collection." disabled={false} speed={3} />
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-500" /></div>
      ) : projects.length === 0 ? (
        <p className="flex min-h-screen items-center justify-center text-gray-500">No projects found.</p>
      ) : (
        <div ref={viewportRef} className="relative h-screen w-full overflow-hidden">
          <div ref={trackRef} className="absolute left-0 top-1/2 flex w-max -translate-y-1/2 items-center gap-6 md:gap-10">
            {projects.map((project, index) => <ProjectCard key={project.id} index={index} {...project} />)}
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
