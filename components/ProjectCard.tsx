import Image from "next/image";
import { Col } from "react-bootstrap";
import noImage from "@/assets/images/no-preview-img.jpg";
import CustomButton from "./Button";

interface ProjectCardProps {
  title: string;
  description: string;
  imgURL: string;
  githubURL: string;
  webURL: string;
}

const ProjectCard = ({
  title,
  description,
  imgURL,
  githubURL,
  webURL,
}: ProjectCardProps) => {
  return (
    <Col sm={6} md={4}>
      <div className="proj-imgbx">
        <Image
          src={imgURL ? imgURL : noImage}
          alt={title}
          width={300}
          height={200}
          className="proj-img"
        />
        <div className="proj-txtx">
          <h4 className="mt-1 text-[25px] font-bold tracking-[0.8px] leading-[1.1em]">
            {title}
          </h4>
          <div className="w-full flex justify-center">
            <span className="text-[14px] text-gray-100 px-2 italic font-normal tracking-[0.8px] text-wrap">
              {description}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center mt-2 mb-1 gap-2">
            {webURL && <CustomButton Url={webURL} text="Live Site" />}
            <CustomButton Url={githubURL} text="GitHub Repository" />
          </div>
        </div>
      </div>
    </Col>
  );
};

export default ProjectCard;
