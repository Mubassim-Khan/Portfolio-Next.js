import { ProjectsData } from '@/PortfolioData';
import { Col, Container, Row } from 'react-bootstrap';
import ProjectCard from './ProjectCard';

const Projects = () => {
  return (
    <section className='project' id='project'>
      <Container>
        <Row>
          <Col>
            <h2 className='text-[45px] font-bold text-center'>Projects</h2>
            <p className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] my-[14px] mt-[14px] mb-[75px]">
              A showcase of my hands-on experience, turning ideas into impactful digital solutions using modern web technologies
            </p>
            <Row>
              {ProjectsData.map((project, id) => {
                return (
                  <ProjectCard
                    key={id}
                    {...project}
                  />
                )
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Projects;