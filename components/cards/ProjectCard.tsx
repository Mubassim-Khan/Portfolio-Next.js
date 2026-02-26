"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import noImage from "@/public/assets/images/no-preview-img.jpg";
import CustomButton from "./Button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  coverImage?: string;
  githubURL: string;
  url?: string;
  index: number;
}

const ProjectCard = ({
  name,
  description,
  coverImage,
  githubURL,
  url,
  index,
}: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = (e: React.MouseEvent) => {
    // Only leave if we're not entering a button
    if (!isButtonHovered) {
      setIsHovered(false);
    }
  };

  const handleButtonMouseEnter = () => {
    setIsButtonHovered(true);
    setIsHovered(true); // Keep card hovered when button is hovered
  };

  const handleButtonMouseLeave = () => {
    setIsButtonHovered(false);
  };

  return (
    <div
      className="
        project-card
        w-[700px] h-[400px]
        rounded-2xl shadow-2xl overflow-hidden
        relative
        cursor-pointer
        transition-all duration-500
        flex-shrink-0
      "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src={coverImage || noImage}
          alt={name}
          fill
          className={`
            object-cover
            transition-all duration-700
            ${isHovered ? "scale-110 blur-sm brightness-50" : ""}
          `}
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>

      {/* Dark overlay for text readability */}
      <div
        className={`
        absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent
        transition-opacity duration-500
        ${isHovered ? "opacity-100" : "opacity-0"}
      `}
      />

      {/* Default state - Just project name */}
      {/* <div
        className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-500
        ${isHovered ? "opacity-0" : "opacity-100"}
      `}
      >
        <h3
          className="
          text-4xl font-bold
          bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent
          drop-shadow-lg
          text-center px-8
        "
        >
          {name}
        </h3>
      </div> */}

      {/* Hover state - Full content */}
      <div
        className={`
        absolute inset-0 p-8
        flex flex-col justify-between
        transition-all duration-700
        ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      >
        {/* Top section */}
        <div>
          <h3
            className="
            text-white text-4xl font-bold mb-4
            drop-shadow-lg
          "
          >
            {name}
          </h3>

          <p
            className="
            text-gray-200 text-lg
            leading-relaxed
            max-w-[90%]
            drop-shadow
          "
          >
            {description}
          </p>
        </div>

        {/* Bottom section - Buttons */}
        <div className="flex gap-4">
          {url && (
            <div
              onMouseEnter={handleButtonMouseEnter}
              onMouseLeave={handleButtonMouseLeave}
            >
              <CustomButton
                Url={url}
                text="Live Demo"
                icon={<ExternalLink size={20} />}
              />
            </div>
          )}

          <div
            onMouseEnter={handleButtonMouseEnter}
            onMouseLeave={handleButtonMouseLeave}
          >
            <CustomButton
              Url={githubURL}
              text="View Code"
              icon={<Github size={20} />}
            />
          </div>
        </div>
      </div>

      {/* Glow effect on hover */}
      <div
        className={`
        absolute inset-0 rounded-2xl
        transition-all duration-700
        ${
          isHovered
            ? "shadow-[0_0_40px_rgba(59,130,246,0.5)] border border-blue-400/30"
            : "shadow-none"
        }
        pointer-events-none
      `}
      />
    </div>
  );
};

export default ProjectCard;
