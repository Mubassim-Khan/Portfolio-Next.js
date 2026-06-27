"use client";

import Image from "next/image";
import Link from "next/link";
import { techNames } from "@/data/mobile/projectsData";

type TechItem = string | { label: string; icon: React.ComponentType<{ className?: string }> };

type Project = {
  title: string;
  slug: string;
  src: string;
  imageTitle: string;
  description: string;
  tech: TechItem[];
  github?: string;
  live?: string;
  video?: string;
};

type ProjectCardProps = {
  project: Project;
  setActiveVideo: (video: string | null) => void;
  isPriority?: boolean;
};

export function ProjectCard({ project, setActiveVideo, isPriority }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group block relative z-10"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-[6px] border border-black/10 dark:border-white/[0.15] bg-zinc-50 dark:bg-zinc-900 shadow-sm">
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src={project.src}
            alt={project.imageTitle}
            fill
            priority={isPriority}
            sizes="(min-width: 768px) 20vw, 90vw"
            quality={70}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
        {project.video && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setActiveVideo(project.video!);
            }}
            className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="Play video"
          >
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-zinc-900 ml-0.5" fill="currentColor">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          </button>
        )}
      </div>
      <div className="mt-2.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-zinc-800 dark:text-zinc-200 truncate group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
            {project.title}
          </h3>
          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-1">
            {project.description}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {project.tech.slice(0, 3).map((t, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded-[3px] bg-zinc-100 dark:bg-zinc-800 text-[9px] font-medium text-zinc-500 dark:text-zinc-400">
              {typeof t === "string" ? techNames[t] ?? t : t.label}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}

export function ProjectsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <ProjectCardSkeleton />
      <ProjectCardSkeleton />
    </div>
  );
}

function ProjectCardSkeleton() {
  return (
    <div className="block relative z-10 animate-pulse">
      <div className="relative aspect-video w-full rounded-[6px] bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-2.5 space-y-1.5">
        <div className="h-3 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-2 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
