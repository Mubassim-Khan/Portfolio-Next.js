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
  if (!trackRef.current || projects.length === 0) return;

  let animation: gsap.core.Tween;
  let cardTriggers: ScrollTrigger[] = [];

  // Create GSAP context with proper scope
  const ctx = gsap.context(() => {
    // Remove this line - don't kill all ScrollTriggers inside context
    // ScrollTrigger.getAll().forEach((t) => t.kill());

    const cardWidth = 700;
    const gap = 40;
    const cardCount = projects.length;

    // Get the actual cards container dimensions
    const cardsContainer = cardsContainerRef.current;
    if (!cardsContainer) return;
    const containerRect = cardsContainer.getBoundingClientRect();
    const containerWidth = containerRect.width;

    // Calculate total width of all cards
    const totalCardsWidth = cardWidth * cardCount + gap * (cardCount - 1);

    // Initial position: first card should be half visible on right side of CONTAINER
    const initialPosition = containerWidth - cardWidth / 2;

    // Horizontal movement: We need to move the track so that:
    const finalPosition = -(totalCardsWidth - cardWidth);
    const horizontalMovement = initialPosition - finalPosition;

    // Set initial position
    gsap.set(trackRef.current, {
      x: initialPosition,
    });

    // Create the horizontal scroll animation
    const animation = gsap.to(trackRef.current, {
      x: finalPosition,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${horizontalMovement * 1.8}`,
        scrub: 1,
        pin: true,
        pinSpacing: "margin",
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Simple opacity/scale effects for cards
    const cards = gsap.utils.toArray(".project-card") as HTMLElement[];

    cards.forEach((card, index) => {
      // Initial state - only set opacity for non-visible cards
      if (index !== 0) {
        gsap.set(card, {
          opacity: 0.8,
          scale: 0.95,
        });
      }

      // Animate when card enters/leaves center
      ScrollTrigger.create({
        trigger: card,
        containerAnimation: animation,
        start: "left 75%",
        end: "left 25%",
        scrub: 1,
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
          });
        },
        onLeave: () => {
          gsap.to(card, {
            opacity: 0.8,
            scale: 0.95,
            duration: 0.5,
          });
        },
        onEnterBack: () => {
          gsap.to(card, {
            opacity: 1,
            scale: 1,
            duration: 0.5,
          });
        },
        onLeaveBack: () => {
          gsap.to(card, {
            opacity: 0.8,
            scale: 0.95,
            duration: 0.5,
          });
        },
      });
    });
  }, containerRef); // ← ADD THIS: Pass the scope (containerRef)

  // Handle resize
  const handleResize = () => {
    ScrollTrigger.refresh();
  };
  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    ctx.revert(); // ← This cleans up everything
    // REMOVE THIS: Don't kill again after context revert
    // ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}, [projects]);

  return (
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
  );
};

export default Projects;
