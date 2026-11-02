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
      const centeredX = viewport.clientWidth / 2 - cardWidth / 2;
      const offscreenX = viewport.clientWidth + Math.min(cardWidth * 0.35, 260);
      const travel = Math.max(0, track.scrollWidth - cardWidth);
      const finalX = viewport.clientWidth * 0.08 - travel;
      const cards = gsap.utils.toArray<HTMLElement>(".project-card", track);

      gsap.set(track, { x: offscreenX, y: window.innerHeight * 0.3, scale: 0.72, autoAlpha: 0 });
      gsap.set(cards, { y: 28, scale: 0.94, autoAlpha: 0 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
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
    <section
      ref={sectionRef}
      id="project"
      className={`relative w-full overflow-hidden ${
        projects.length > 0 ? "min-h-[250svh] md:min-h-[260vh]" : "min-h-screen"
      }`}
    >
      <div className="pointer-events-none relative z-20 mx-auto max-w-[1140px] px-4 pt-12 pb-4 md:pt-16 md:pb-6">
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
        <div
          ref={viewportRef}
          className="sticky top-0 h-[100svh] min-h-[440px] w-full overflow-hidden md:min-h-[520px]"
        >
          <div ref={trackRef} className="absolute left-0 top-[58%] flex w-max -translate-y-1/2 items-center gap-6 md:top-1/2 md:gap-10">
            {projects.map((project, index) => <ProjectCard key={project.id} index={index} {...project} />)}
          </div>
        </div>
      )}
    </section>
  );
};

export default Projects;
