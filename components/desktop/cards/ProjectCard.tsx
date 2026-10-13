"use client";

import { useState } from "react";
import Image from "next/image";
import noImage from "@/public/assets/images/no-preview-img.jpg";
import CustomButton from "../misc/Button";
import { ExternalLink, Github } from "lucide-react";

interface ProjectCardProps {
  name: string;
  description: string;
  coverImage?: string;
  githubURL?: string;
  url?: string;
  index: number;
  videoUrl?: string;
}

const ProjectCard = ({
  name,
  description,
  coverImage,
  githubURL,
  url,
  index,
  videoUrl,
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

  const mediaSource = videoUrl || (coverImage && /\.(mp4|webm|ogg)(\?.*)?$/i.test(coverImage) ? coverImage : undefined);
  const isYouTube = Boolean(mediaSource?.includes("youtube.com/embed") || mediaSource?.includes("youtu.be/"));
  const autoplayVideoUrl = isYouTube && mediaSource
    ? `${mediaSource}${mediaSource.includes("?") ? "&" : "?"}autoplay=1&mute=1&loop=1&controls=0&playsinline=1`
    : mediaSource;

  return (
    <div
      className="
        project-card
        w-[86vw] max-w-[700px] lg:w-[700px] h-[400px] lg:h-[450px]
        rounded-2xl shadow-2xl overflow-hidden
        relative
        cursor-pointer
        bg-neutral-950
        flex-shrink-0
        transition-all duration-500
      "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        {autoplayVideoUrl ? (
          isYouTube ? (
            <iframe
              src={autoplayVideoUrl}
              title={`${name} preview`}
              className="h-full w-full scale-[1.02] border-0 object-cover pointer-events-none"
              allow="autoplay; encrypted-media; picture-in-picture"
              tabIndex={-1}
            />
          ) : (
            <video
              src={autoplayVideoUrl}
              className={`h-full w-full object-cover transition-all duration-700 ${isHovered ? "scale-110 brightness-50" : ""}`}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          )
        ) : (
          <Image
            src={coverImage || noImage}
            alt={name}
            fill
            className={`
              object-contain
              transition-all duration-700
              ${isHovered ? "scale-110 blur-sm brightness-50" : ""}
            `}
            sizes="(max-width: 768px) 100vw, 700px"
          />
        )}
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
        absolute inset-0 p-8 md:p-10
        flex flex-col justify-end
        transition-all duration-700
        ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
      `}
      >
        <div className={`transition-all duration-500 delay-100 ${isHovered ? "translate-y-0" : "translate-y-4"}`}>
          <h3
            className="
            text-white text-3xl md:text-4xl font-bold mb-3
            drop-shadow-lg
          "
          >
            {name}
          </h3>

          <p
            className="
            text-gray-300 text-base md:text-lg
            leading-relaxed
            max-w-[95%]
            drop-shadow
            mb-6
          "
          >
            {description}
          </p>

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

            {githubURL && (
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
            )}
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
            ? "shadow-[0_0_40px_rgba(168,85,247,0.4)] border border-purple-400/30"
            : "shadow-none"
        }
        pointer-events-none
      `}
      />
    </div>
  );
};

export default ProjectCard;
