import { ProjectsData } from "@/PortfolioData";
import { Col, Container, Row } from "react-bootstrap";

import ProjectCard from "./ProjectCard";
import ShinyText from "./ShinyText";
import BlurText from "./BlurText";

const Projects = () => {
  return (
    <section className="project" id="project">
      <Container>
        <Row>
          <Col>
            <div className="gradient-effect-3"></div>
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
            <Row>
              {ProjectsData.map((project, id) => {
                return <ProjectCard key={id} {...project} />;
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Projects;
