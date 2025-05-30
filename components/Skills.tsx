import { Col, Container, Row } from 'react-bootstrap'
import { LanguageSkills } from "@/PortfolioData";
import SkillBox from './SkillBox';

const Skills = () => {
  const languages = LanguageSkills.slice(0, 4);
  const frameworks = LanguageSkills.slice(4, 8);
  const databases = LanguageSkills.slice(8, 10);
  const cssFrameworks = LanguageSkills.slice(10, 12);
  const versionControl = LanguageSkills.slice(12, 13);
  return (
    <section className='skill' id="skills">
      <Container>
        <Row>
          <Col>
            <div className="gradient-effect-1"></div>
            <div className="gradient-effect-2"></div>
            <div className='skill-bx'>
              <h2 className='text-[45px] font-bold'>Skills</h2>
              <p className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] my-[14px] mt-[14px] mb-[75px]">
                A versatile blend of languages, frameworks, and tools that power my development journey
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <SkillBox title="Languages" skills={languages} />
                <SkillBox title="Libraries & Frameworks" skills={frameworks} />
                <SkillBox title="Databases" skills={databases} />
                <SkillBox title="CSS Frameworks" skills={cssFrameworks} />
                <SkillBox title="Version Control" skills={versionControl} />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default Skills;