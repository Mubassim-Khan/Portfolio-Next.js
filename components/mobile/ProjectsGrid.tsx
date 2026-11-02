"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
} from "@/data/mobile/projectsData";

export {
  type TechIcon,
  type TechKey,
  type TechItem,
  type Project,
  iconMap,
  techNames,
};

const projectTechMap: Record<string, TechItem[]> = {
  "Imaginify AI": ["next", "tailwind", "stripe", "cloudinary", "mongodb"],
  "Clypp": ["next", "ts", "tailwind", { label: "GSAP", tooltip: "GSAP" }],
  "F1 predictor model": ["python", "flask", "js", "html", "css3"],
};

type ApiProject = {
  id: string;
  name: string;
  description: string;
  url?: string;
  githubURL: string;
  coverImage: string;
  featured: boolean;
  order: number | null;
  videoUrl?: string | null;
  technologies?: string[];
};

function mapApiToProject(api: ApiProject): Project {
  const tech: TechItem[] = [];
  if (api.technologies?.length) {
    for (const t of api.technologies) {
      const key = t.toLowerCase().replace(/[^a-z0-9]/g, "") as TechKey;
      if (key in iconMap) {
        tech.push(key);
      } else {
        tech.push({ label: t, tooltip: t });
      }
    }
  } else {
    const mapped = projectTechMap[api.name] ?? projectTechMap[api.id] ?? projectTechMap[Object.keys(projectTechMap).find(k => k.toLowerCase() === api.name.toLowerCase()) ?? ""];
    if (mapped) tech.push(...mapped);
  }
  return {
    slug: api.id,
    title: api.name,
    imageTitle: "Preview",
    src: api.coverImage || "/assets/images/no-preview-img.jpg",
    video: api.videoUrl || (api.coverImage && /\.(mp4|webm|ogg)(\?.*)?$/i.test(api.coverImage) ? api.coverImage : ""),
    description: api.description || "No description",
    tech,
    github: api.githubURL || "",
    live: api.url || "",
    hasPin: api.featured || false,
  };
}

export const ProjectCard = ({
  project,
  setActiveVideo,
  isPriority = false,
  deck = false,
}: {
  project: Project;
  setActiveVideo: (v: string) => void;
  isPriority?: boolean;
  deck?: boolean;
}) => {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const [shouldLoadHoverImage, setShouldLoadHoverImage] = useState(false);
  const { resolvedTheme } = useTheme();
  const router = useRouter();

  const isNotStarted = !project.video && !project.live && !project.github;
  const statusColor = isNotStarted ? "bg-zinc-400" : "bg-emerald-500";
  const statusLabel = isNotStarted ? "Not Started" : "Live";

  return (
    <div
      className={`flex flex-col group cursor-pointer ${deck ? "w-[min(82vw,370px)] shrink-0" : ""}`}
      onClick={() => router.push(`/projects/${project.slug}`)}
      onMouseEnter={() => setShouldLoadHoverImage(true)}
      onFocus={() => setShouldLoadHoverImage(true)}
      onTouchStart={() => setShouldLoadHoverImage(true)}
    >
      <motion.div
        className="relative w-full aspect-[1.25] rounded-xl border border-black/5 dark:border-white/5 bg-zinc-50/80 dark:bg-[#09090b]/80 shadow-sm p-3.5 pb-0 flex flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:border-black/10 dark:hover:border-white/10 sm:aspect-[1.4] sm:p-4 sm:pb-0"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        <div className="flex items-center justify-end z-10 min-h-[24px]">
          {project.hasPin && (
            <div className="w-6 h-6 rounded-[6px] bg-transparent border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-center text-zinc-400 dark:text-zinc-500">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 17v5" /><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
              </svg>
            </div>
          )}
        </div>

        {project.backgroundImage && (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: shouldLoadHoverImage ? `url('${project.backgroundImage}')` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            variants={{
              rest: { opacity: 0, scale: 1 },
              hover: { opacity: 1, scale: 1.05 },
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        )}

        <motion.h1
          className="absolute top-4 left-4 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 z-30 uppercase tracking-widest drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
          variants={{
            rest: { left: "1rem", top: "1rem", x: "0%", color: "#71717a", opacity: 0 },
            hover: { left: "50%", top: "25%", x: "-50%", color: "#ffffff", opacity: 1 },
          }}
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          Play Video
        </motion.h1>

        {project.video && (
          <motion.div
            className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none group-hover:pointer-events-auto"
            variants={{ rest: { scale: 0.5, opacity: 0 }, hover: { scale: 1, opacity: 1 } }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
          >
            <div 
              className="h-10 w-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 active:scale-95 transition-transform duration-200 border border-white/50"
              onClick={(e) => {
                e.stopPropagation();
                if (project.video) setActiveVideo(project.video);
              }}
            >
              <svg className="w-4 h-4 text-zinc-900 ml-0.5 fill-current" viewBox="0 0 24 24">
                <path d="M5.25 5.653v12.694c0 .856.926 1.39 1.668.958l11.1-6.347a1.125 1.125 0 000-1.916L6.918 4.695c-.742-.432-1.668.102-1.668.958z" />
              </svg>
            </div>
          </motion.div>
        )}

        <motion.div
          className="absolute bottom-0 left-1/2 w-full rounded-t-[10px] bg-white dark:bg-[#0a0a0a] p-0 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.5)] z-20 border border-black/5 dark:border-white/[0.15] border-b-0"
          variants={{
            rest: { height: "78%", y: 0, x: "-50%" },
            hover: { height: "72%", y: 4, x: "-50%" },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="size-full overflow-hidden rounded-t-[9px]">
            {project.video && !project.video.includes("youtube") ? (
              <video src={project.video} className="size-full object-cover" autoPlay muted loop playsInline preload="metadata" />
            ) : project.video?.includes("youtube") ? (
              <iframe
                src={`${project.video}${project.video.includes("?") ? "&" : "?"}autoplay=1&mute=1&loop=1&controls=0&playsinline=1`}
                title={`${project.title} preview`}
                className="size-full border-0 pointer-events-none"
                allow="autoplay; encrypted-media; picture-in-picture"
                tabIndex={-1}
              />
            ) : (
              <Image
                src={project.src}
                alt={`${project.title} preview`}
                width={600}
                height={400}
                preload={isPriority}
                sizes="(min-width: 768px) 17vw, calc(100vw - 2rem)"
                quality={70}
                className="size-full object-cover"
              />
            )}
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-4 flex flex-col px-0.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <h3 className="text-[15px] font-bold text-zinc-900 dark:text-zinc-100 leading-tight">{project.title}</h3>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 w-fit shrink-0">
            <div className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{statusLabel}</span>
          </div>
        </div>

        <p className="mt-2 sm:mt-1.5 text-[13px] text-zinc-500 dark:text-zinc-400 leading-relaxed pr-2">
          {project.description}
        </p>

        <div className="flex items-center justify-between gap-3 mt-3">
          <div className="flex gap-2 flex-wrap">
            {project.tech.map((item) => {
              const key = typeof item === "string" ? item : item.label;
              const isIconItem = typeof item === "string";
              const tooltipText = isIconItem ? techNames[item] : item.tooltip || item.label;
              const uniqueId = `${project.title}-${key}`;

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setHoveredTech(uniqueId)}
                  onMouseLeave={() => setHoveredTech(null)}
                >
                  {isIconItem ? (
                    (() => {
                      const TechIcon = iconMap[item];
                      return TechIcon ? <TechIcon className="w-4 h-4 md:w-3.5 md:h-3.5 text-zinc-400 dark:text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors" /> : null;
                    })()
                  ) : (
                    <span className="flex items-center justify-center w-4 h-4 md:w-3.5 md:h-3.5 text-[9px] font-semibold text-zinc-500 dark:text-zinc-400 leading-none">
                      {item.label}
                    </span>
                  )}
                  <AnimatePresence>
                    {hoveredTech === uniqueId && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -top-7 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-zinc-800 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 text-[10px] px-2 py-0.5 rounded shadow-xl whitespace-nowrap">
                          {tooltipText}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-zinc-500 transition-colors cursor-pointer group-hover:text-zinc-800 dark:group-hover:text-zinc-200 sm:text-[12px]" onClick={(e) => { e.stopPropagation(); if (project.live) window.open(project.live, "_blank"); else if (project.github) window.open(project.github, "_blank"); }}>
            View Project
            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export function ProjectsGrid() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/portfolio/projects", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load projects");
        return res.json();
      })
      .then((data) => {
        setProjects(Array.isArray(data) ? data : data.projects ?? []);
      })
      .catch((error) => {
        if (error.name !== "AbortError") toast.error("Failed to fetch projects");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveVideo(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const mapped = projects.map(mapApiToProject);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track || loading || projects.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stage.style.height = "auto";
      stage.style.overflow = "visible";
      track.classList.add("flex-wrap");
      return () => track.classList.remove("flex-wrap");
    }

    const context = gsap.context(() => {
      const firstCard = track.querySelector<HTMLElement>(".group");
      if (!firstCard) return;

      const cardWidth = firstCard.offsetWidth;
      const travel = Math.max(0, track.scrollWidth - cardWidth);
      const centeredX = stage.clientWidth / 2 - cardWidth / 2;
      const finalX = stage.clientWidth * 0.08 - travel;

      gsap.set(track, { x: stage.clientWidth + 44, y: 96, scale: 0.76, autoAlpha: 0 });
      gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top 12%",
          end: `+=${Math.max(window.innerHeight * 1.65, travel + cardWidth)}`,
          scrub: 0.75,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
        .to(track, { x: centeredX, y: 0, scale: 1, autoAlpha: 1, duration: 0.3, ease: "power3.out" })
        .to(track, { x: finalX, duration: 0.7, ease: "none" });

      ScrollTrigger.refresh();
    }, stage);

    return () => context.revert();
  }, [loading, projects]);

  return (
    <>
      <div className="relative z-10 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="relative aspect-[1.25] rounded-xl bg-zinc-100 dark:bg-zinc-800" />
                <div className="mt-4 space-y-2 px-0.5">
                  <div className="h-4 w-2/3 rounded bg-zinc-100 dark:bg-zinc-800" />
                  <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : mapped.length === 0 ? (
          <p className="py-6 text-center text-[13px] text-zinc-500 dark:text-zinc-400">No projects found.</p>
        ) : (
          <div ref={stageRef} className="relative -mx-4 h-[520px] overflow-hidden sm:h-[560px]">
            <div ref={trackRef} className="absolute left-0 top-1/2 flex w-max -translate-y-1/2 items-start gap-5 px-4">
              {mapped.map((project, index) => (
                <ProjectCard key={project.slug} project={project} setActiveVideo={setActiveVideo} isPriority={index === 0} deck />
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[100] cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-black rounded-xl overflow-hidden w-[90%] max-w-3xl shadow-2xl"
            >
              <button
                onClick={() => setActiveVideo(null)}
                className="absolute top-3 right-3 p-2 bg-neutral-800/80 hover:bg-neutral-700 rounded-full cursor-pointer transition-colors z-50"
              >
                <X size={20} className="text-neutral-200" />
              </button>
              {activeVideo.includes("youtube") ? (
                <iframe src={activeVideo} className="w-full aspect-video border-0" allowFullScreen />
              ) : (
                <video src={activeVideo} className="w-full h-auto" controls autoPlay />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
