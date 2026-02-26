"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import ProjectCard from "./ProjectCard";
import ShinyText from "./ShinyText";
import BlurText from "./BlurText";
import toast from "react-hot-toast";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  name: string;
  description: string;
  url?: string;
  githubURL: string;
  coverImage: string;
};

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/portfolio/projects");
        if (!res.ok) {
          toast.error("Failed to fetch projects");
          return;
        }
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Horizontal Scroll Animation
  // Horizontal Scroll Animation
  useEffect(() => {
    if (
      !trackRef.current ||
      !containerRef.current ||
      !cardsContainerRef.current ||
      projects.length === 0
    )
      return;

    const ctx = gsap.context(() => {
      const cardWidth = 700;
      const gap = 40;
      const cardCount = projects.length;

      const containerWidth = cardsContainerRef.current!.offsetWidth;
      const totalCardsWidth = cardWidth * cardCount + gap * (cardCount - 1);

      const initialPosition = containerWidth - cardWidth / 2;
      const finalPosition = -(totalCardsWidth - cardWidth);

      gsap.set(trackRef.current, { x: initialPosition });

      // Horizontal scroll animation
      const horizontalTween = gsap.to(trackRef.current, {
        x: finalPosition,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${(initialPosition - finalPosition) * 1.8}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Card fade / scale animations
      const cards = gsap.utils.toArray(".project-card") as HTMLElement[];

      cards.forEach((card, index) => {
        if (index !== 0) {
          gsap.set(card, { opacity: 0.8, scale: 0.95 });
        }

        gsap.to(card, {
          opacity: 1,
          scale: 1,
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: "left 75%",
            end: "left 25%",
            scrub: 1,
          },
        });
      });

      ScrollTrigger.refresh();
    }, containerRef); // important scope binding

    // Cleanup — clean ONLY what belongs to this component
    return () => ctx.revert();
  }, [projects]);

  return (
    <main>
      <section ref={containerRef} id="project" className="relative w-full">
        <div className="max-w-[1140px] mx-auto px-4 py-10 relative z-10">
          {/* Header */}
          <div className="text-[50px] font-bold text-center mb-4">
            <BlurText
              text="Projects"
              delay={250}
              animateBy="words"
              direction="top"
              className="text-[50px] font-bold text-center"
            />
          </div>

          <div className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em]">
            <ShinyText
              text="A showcase of my hands-on experience, turning ideas into impactful digital solutions using modern web technologies"
              disabled={false}
              speed={3}
              className="custom-class"
            />
          </div>

          {/* Cards Container */}
          {loading ? (
            <div className="w-full flex justify-center py-20">
              <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
            </div>
          ) : projects.length === 0 ? (
            <p className="w-full text-center text-gray-500 py-20">
              No projects found.
            </p>
          ) : (
            <div
              ref={cardsContainerRef}
              className="relative h-[500px] overflow-visible"
              style={{
                position: "relative",
              }}
            >
              <div
                ref={trackRef}
                className="absolute flex gap-10 items-center h-full"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {projects.map((project, i) => (
                  <ProjectCard key={project.id} index={i} {...project} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Projects;
