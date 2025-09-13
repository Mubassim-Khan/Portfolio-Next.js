import LinkedInIcon from "@/assets/icons/linkedInIcon.svg";
import DiscordIcon from "@/assets/icons/discordIcon.svg";
import InstagramIcon from "@/assets/icons/instagramIcon.svg";
import GitHubIcon from "@/assets/icons/githubIcon.svg";
import GmailIcon from "@/assets/icons/gmailIcon.svg";
import ResumeIcon from "@/assets/icons/resumeIcon.png";

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
    username: "mubassimkhan_08",
  },
  {
    id: 4,
    icon: GmailIcon,
    url: "mailto:mubassimkhan@gmail.com",
    alt: "Gmail",
    username: "mubassimkhan@gmail.com",
  },
  {
    id: 5,
    icon: ResumeIcon,
    url: "https://drive.google.com/file/d/1320m3Q7mjxfDCdG4tFqEP7_D1cJwUWaq/view",
    alt: "Resume",
    username: "Resume",
  },
  {
    id: 4,
    icon: InstagramIcon,
    url: "https://www.instagram.com/mubassimahmedkhan",
    alt: "Instagram",
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
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original-wordmark.svg",
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
  // Version Control
  {
    id: 99,
    name: "Git",
    imgURL:
      "https://raw.githubusercontent.com/devicons/devicon/master/icons/git/git-original.svg",
  },
];

// Certificate Data consisting of various courses and certifications
export const CertificateData = [
  {
    title: "Foundational Generative AI - iNeuron",
    skill: "Generative AI",
    verifyLink:
      "https://learn.ineuron.ai/certificate/a6eddac2-5014-460c-afd4-ab273969a93b",
  },
  {
    title: "Generative AI with Large Language Models - AWS | DeepLearning.AI",
    skill: "Generative AI",
    verifyLink: "https://coursera.org/verify/A1N8VDV2FCUIY",
  },
  {
    title: "Google IT Automation with Python - Google",
    skill: "Automation",
    verifyLink: "https://coursera.org/verify/professional-cert/N9YF92Y9QP8P",
  },
  {
    title:
      "Backend Web Development with Node.js and Express - Microsoft Learn Student Ambassador",
    skill: "Backend Development",
    verifyLink: "https://cert.devtown.in/verify/19wlu6",
  },
  {
    title: "DevOps for Web Development - Google Developer Student Clubs",
    skill: "DevOps for Web Development",
    verifyLink: " ",
  },
  {
    title: "Introduction to Software Engineering - IBM",
    skill: "Software Engineering",
    verifyLink: "https://coursera.org/verify/0U1KZ7GBNKPT",
  },
];

// Project Data
export const ProjectsData = [
  {
    id: 1,
    title: "Clypp",
    description:
      "A Netflix-inspired streaming UI built with Next.js, TypeScript, Tailwind CSS, and GSAP for smooth animations.",
    imgURL:
      "https://raw.githubusercontent.com/Mubassim-Khan/Clypp/refs/heads/main/public/images/Preview_1.png",
    webURL: "https://clypp.vercel.app/",
    githubURL: "https://github.com/Mubassim-Khan/Clypp",
  },
  {
    id: 2,
    title: "DocTools",
    description:
      "DocTools is an all-in-one document utility for file conversion, OCR, AI summaries & QR code generation, built with FastAPI and React.",
    imgURL:
      "https://raw.githubusercontent.com/Mubassim-Khan/DocTools/refs/heads/master/frontend/src/assets/Preview.png",
    webURL: "https://m-doctools.vercel.app",
    githubURL: "https://github.com/Mubassim-Khan/DocTools",
  },
  {
    id: 3,
    title: "Spotify Clone",
    description:
      "Spotify Clone lets users play and explore music, built with Next.js and Supabase.",
    imgURL:
      "https://raw.githubusercontent.com/Mubassim-Khan/Spotify-Clone-Next.js/master/assets/Preview.png",
    webURL: "https://spotify-clone-ivory-sigma.vercel.app",
    githubURL: "https://github.com/Mubassim-Khan/Spotify-Clone-Next.js",
  },
  {
    id: 4,
    title: "Imaginify AI",
    description:
      "An AI SaaS platform built with Next.js that lets users manipulate images.",
    imgURL:
      "https://raw.githubusercontent.com/Mubassim-Khan/Imaginify-AI/refs/heads/master/public/assets/images/Preview.png",
    webURL: "https://imaginify-ai-eight.vercel.app/",
    githubURL: "https://github.com/Mubassim-Khan/Imaginify-AI",
  },
  {
    id: 5,
    title: "zNotebook",
    description:
      "zNotebook is a cloud notebook website, made using MERN Stack, Tailwind CSS & Framer Motion.",
    imgURL:
      "https://raw.githubusercontent.com/Mubassim-Khan/zNotebook/main/frontend/src/assets/images/Preview.png",
    webURL: "https://znotebook.vercel.app/",
    githubURL: "https://github.com/Mubassim-Khan/zNotebook",
  },
  {
    id: 6,
    title: "F1 Prediction App",
    description:
      "Predicts lap times and race outcomes with ML models on FastF1 telemetry, built with Flask, JavaScript, HTML & CSS.",
    imgURL:
      "https://raw.githubusercontent.com/Mubassim-Khan/F1-Predictor/refs/heads/main/static/images/preview.png",
    webURL: "",
    githubURL: "https://github.com/Mubassim-Khan/F1-Predictor",
  },
];
