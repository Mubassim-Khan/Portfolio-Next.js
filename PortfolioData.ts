import LinkedInIcon from "@/public/assets/icons/linkedInIcon.svg";  
import DiscordIcon from "@/public/assets/icons/discordIcon.svg";
import GitHubIcon from "@/public/assets/icons/githubIcon.svg";
import GmailIcon from "@/public/assets/icons/gmailIcon.svg";
import Shadcn from "@/public/assets/icons/shadcn-ui.png";
import SQLiteIcon from "@/public/assets/icons/SQLiteIcon.png";
import YOLO from "@/public/assets/icons/yolo-logo.svg";
import ChaseValueLogo from "@/public/assets/logos/cv-logo.png";
import BrookesLogo from "@/public/assets/logos/brookes-logo.jpg";

// Links & Icons for Social Media
export const SocialLinks = [
  {
    id: 1,
    icon: LinkedInIcon,
    url: "https://www.linkedin.com/in/mubassim",
    alt: "LinkedIn",
    username: "Mubassim Ahmed Khan",
  },
  {
    id: 2,
    icon: GitHubIcon,
    url: "https://www.github.com/Mubassim-Khan",
    alt: "GitHub",
    username: "Mubassim-Khan",
  },
  {
    id: 3,
    icon: DiscordIcon,
    url: "https://discord.com/users/732681893484691518",
    alt: "Discord",
    username: "@mubassimkhan_08",
  },
  {
    id: 4,
    icon: GmailIcon,
    url: "mailto:mubassimkhan@gmail.com",
    alt: "Gmail",
    username: "mubassimkhan@gmail.com",
  },
];

// Skills Data consisting of various programming languages, frameworks, libraries, and tools
export const LanguageSkills = [
  // Langauges
  {
    id: 3,
    name: "JavaScript",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg",
  },
  {
    id: 4,
    name: "Typescript",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg",
  },
  {
    id: 12,
    name: "Java",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/java/java-original.svg",
  },
  {
    id: 13,
    name: "Python",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg",
  },
  // Frameworks/Libraries
  {
    id: 1,
    name: "React.js",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg",
  },
  {
    id: 2,
    name: "Next.js",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg",
  },
  {
    id: 5,
    name: "Node.js",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg",
  },
  {
    id: 6,
    name: "Express.js",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original.svg",
  },
  {
    id: 77,
    name: "Flask",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/flask/flask-original.svg",
  },
  {
    id: 773,
    name: "Django",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/django/django-plain-wordmark.svg",
  },
  {
    id: 774,
    name: "Flutter",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/flutter/flutter-original.svg",
  },
  // Databases
  {
    id: 7,
    name: "MongoDB",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg",
  },
  {
    id: 8,
    name: "MySQL",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg",
  },
  {
    id: 9,
    name: "PostgreSQL",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/postgresql/postgresql-original.svg",
  },
  {
    id: 100,
    name: "Firebase",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/firebase/firebase-original.svg",
  },
  {
    id: 990,
    name: "Prisma",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/prisma/prisma-original.svg",
  },
  {
    id: 90,
    name: "SQLite",
    imgURL: SQLiteIcon.src,
  },
  {
    id: 199,
    name: "Redis",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/redis/redis-original.svg",
  },
  // CSS Frameworks
  {
    id: 10,
    name: "Tailwind CSS",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg",
  },
  {
    id: 11,
    name: "Bootstrap",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/master/icons/bootstrap/bootstrap-original.svg",
  },
  {
    id: 101,
    name: "ShadCN UI",
    imgURL: Shadcn.src,
  },
  // Version Control
  {
    id: 99,
    name: "Git",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
  },  
  {
    id: 909,
    name: "Docker",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/docker/docker-original.svg",
  },  
  {
    id: 999,
    name: "GitHub Actions",
    imgURL:
    "https://raw.githubusercontent.com/devicons/devicon/54cfe13ac10eaa1ef817a343ab0a9437eb3c2e08/icons/githubactions/githubactions-original.svg",
  },
  // Computer Vision
  {
    id: 71,
    name: "YOLO",
    imgURL: YOLO.src,
  },
  {
    id: 72,
    name: "PyTorch",
    imgURL: "https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/pytorch/pytorch-original.svg",
  },
];

export const ExperienceData = [
  {
    title: "IT Intern",
    company: "ChaseValue | Head Office, Karachi",
    date: "Jan 2026 - Present",
    description:
      "Developing and implementing advanced computer vision systems, including real-time retail security solutions for theft detection, automated facial recognition-based attendance tracking, and customer interaction analysis. Also collaborating on the development and deployment of full-stack web applications to support business operations.",
    logo: ChaseValueLogo.src,
  },
  {
    title: "Oracle E-Business Suite - Intern",
    company: "Brookes Pharma Pvt. Ltd",
    date: "July 2025 - Aug 2025",
    description:
      "Designed and optimized SQL-based ERP reports, customized Oracle Application Framework (OAF) forms, and built tailored enterprise reports using Oracle Report Builder to streamline business workflows and improve corporate reporting efficiency.",
    logo: BrookesLogo.src,
  },
];
