import Image from "next/image";

import noImage from "@/public/assets/images/no-preview-img.jpg";
import CustomButton from "./Button";

interface ProjectCardProps {
  name: string;
  description: string;
  coverImage: string;
  githubURL: string;
  url?: string;
}

const ProjectCard = ({
  name: title,
  description,
  coverImage,
  githubURL,
  url: webURL,
}: ProjectCardProps) => {
  return (
    <div className="w-full sm:w-1/2 md:w-1/3 px-2 mb-6">
      <div className="proj-imgbx relative overflow-hidden rounded-lg shadow-md bg-gray-800 flex flex-col  ">
        <Image
          src={coverImage || noImage}
          alt={title}
          width={300}
          height={200}
          className="proj-img"
        />
        <div className="proj-txtx p-4">
          <h4 className="mt-1 text-[25px] font-bold tracking-[0.8px] leading-[1.1em] text-white">
            {title}
          </h4>
          <div className="w-full flex justify-center">
            <span className="text-[14px] text-gray-300 px-2 italic font-normal tracking-[0.8px] break-words text-center">
              {description}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center mt-2 mb-1 gap-2">
            {webURL && <CustomButton Url={webURL} text="Live Site" />}
            <CustomButton Url={githubURL} text="GitHub Repository" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
