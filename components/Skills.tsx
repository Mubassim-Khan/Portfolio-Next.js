import { LanguageSkills } from "@/PortfolioData";
import SkillBox from "./SkillBox";
import ShinyText from "./ShinyText";
import BlurText from "./BlurText";

const Skills = () => {
  const languages = LanguageSkills.slice(0, 4);
  const frameworks = LanguageSkills.slice(4, 8);
  const databases = LanguageSkills.slice(8, 10);
  const cssFrameworks = LanguageSkills.slice(10, 12);
  const versionControl = LanguageSkills.slice(12, 13);

  return (
    <section className="skill" id="skills">
      <div className="max-w-[1140px] mx-auto px-4">
        <div className="gradient-effect-1"></div>
        <div className="gradient-effect-2"></div>
        <div className="skill-bx">
          <div className="text-[50px] font-bold text-center">
            <BlurText
              text="Skills"
              delay={250}
              animateBy="words"
              direction="top"
              className="!text-[50px] font-bold text-center mb-3 !text-[#fff]"
            />
          </div>
          <div className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] my-[14px] mt-[15px] mb-[75px]">
            <ShinyText
              text="A versatile blend of languages, frameworks, and tools that power my development journey"
              disabled={false}
              speed={3}
              className="custom-class"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkillBox title="Languages" skills={languages} />
            <SkillBox title="Libraries & Frameworks" skills={frameworks} />
            <SkillBox title="Databases" skills={databases} />
            <SkillBox title="CSS Frameworks" skills={cssFrameworks} />
            <SkillBox title="Version Control" skills={versionControl} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
