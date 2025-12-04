"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import ProjectCard from "./ProjectCard";
import ShinyText from "./ShinyText";
import BlurText from "./BlurText";
import toast from "react-hot-toast";

type Project = {
  id: string;
  name: string;
  description: string;
  url?: string;
  githubURL: string;
  coverImage: string;
};

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <section className="project py-12" id="project">
      <div className="max-w-[1140px] mx-auto px-4">
        {/* Gradient Blob */}
        <div className="absolute bottom-[25rem] -right-48 w-[45rem] h-[35rem] bg-[#628c94] rounded-full blur-[120px] opacity-40 -z-10 translate-y-[80%] animate-pulse md:display-none sm:display-none"></div>

        <div className="text-[45px] font-bold text-center">
          <BlurText
            text="Projects"
            delay={250}
            animateBy="words"
            direction="top"
            className="text-[50px] font-bold text-center"
          />
        </div>
        <div className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] my-[14px] mt-[15px] mb-[75px]">
          <ShinyText
            text="A showcase of my hands-on experience, turning ideas into impactful digital solutions using modern web technologies"
            disabled={false}
            speed={3}
            className="custom-class"
          />
        </div>

        <div className="flex flex-wrap -mx-2">
          {loading ? (
            <div className="w-full flex justify-center py-10">
              <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
            </div>
          ) : projects.length === 0 ? (
            <p className="w-full text-center text-gray-500">
              No projects found.
            </p>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} {...project} />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
