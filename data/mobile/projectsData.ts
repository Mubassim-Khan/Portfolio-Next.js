import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiDocker,
  SiFramer,
  SiPython,
  SiGit,
  SiThreedotjs,
  SiExpress,
} from "react-icons/si";
import type { IconType } from "react-icons";

export type TechKey = string;
export type TechItem = TechKey | { label: string; icon: IconType };

export const techNames: Record<string, string> = {
  react: "React",
  next: "Next.js",
  typescript: "TypeScript",
  tailwind: "Tailwind CSS",
  node: "Node.js",
  mongodb: "MongoDB",
  postgresql: "PostgreSQL",
  prisma: "Prisma",
  docker: "Docker",
  framer: "Framer Motion",
  python: "Python",
  git: "Git",
  three: "Three.js",
  express: "Express",
};

export const iconMap: Record<string, IconType> = {
  react: SiReact,
  next: SiNextdotjs,
  typescript: SiTypescript,
  tailwind: SiTailwindcss,
  node: SiNodedotjs,
  mongodb: SiMongodb,
  postgresql: SiPostgresql,
  prisma: SiPrisma,
  docker: SiDocker,
  framer: SiFramer,
  python: SiPython,
  git: SiGit,
  three: SiThreedotjs,
  express: SiExpress,
};

export type ProjectData = {
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

export const projectsData: ProjectData[] = [
  {
    title: "Draco",
    slug: "draco",
    src: "/project-images/draco.png",
    imageTitle: "Draco - AI coding agent",
    description: "An AI-powered coding agent that helps developers write, refactor, and debug code through natural language commands.",
    tech: ["next", "typescript", "python", "react", "prisma", "postgresql"],
    github: "https://github.com/Ashutoshx7/draco",
  },
  {
    title: "VengenceUI",
    slug: "vengenceui",
    src: "/project-images/vengenceui.png",
    imageTitle: "VengenceUI - Component Library",
    description: "A composable, performance-first UI system for real-world product workflows with 50+ production-ready components.",
    tech: ["next", "typescript", "react", "tailwind", "framer"],
    github: "https://github.com/Ashutoshx7/vengenceui",
    live: "https://vengenceui.vercel.app",
  },
  {
    title: "Caracal",
    slug: "caracal",
    src: "/project-images/caracal.png",
    imageTitle: "Caracal - AI Security Platform",
    description: "An AI-agent security platform that enforces pre-execution authority checks for delegated agent actions.",
    tech: ["python", "typescript", "next", "postgresql", "docker"],
    github: "https://github.com/Ashutoshx7/caracal",
  },
  {
    title: "Portfolio",
    slug: "portfolio",
    src: "/project-images/portfolio.png",
    imageTitle: "Portfolio Website",
    description: "Personal portfolio built with Next.js, featuring both desktop and mobile views with a blueprint-inspired design system.",
    tech: ["next", "typescript", "react", "tailwind", "framer", "three"],
    github: "https://github.com/Ashutoshx7/portfolio",
    live: "https://ashutoshx7.vercel.app",
  },
];
