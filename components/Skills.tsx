import { LanguageSkills } from "@/PortfolioData";
import SkillBox from "./SkillBox";
import ShinyText from "./ShinyText";
import BlurText from "./BlurText";

const Skills = () => {
  const languages = LanguageSkills.slice(0, 4);
  const frameworks = LanguageSkills.slice(4, 9);
  const databases = LanguageSkills.slice(9, 14);
  const cssFrameworks = LanguageSkills.slice(14, 17);
  const versionControl = LanguageSkills.slice(17, 19);

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
              className="!text-[50px] font-bold text-center !text-[#fff] !mb-[0px]"
            />
          </div>
          <div className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] my-[14px] mt-[5px] mb-[75px]">
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
            <SkillBox title="Databases & ORMs" skills={databases} />
            <SkillBox title="Styling & UI Libraries" skills={cssFrameworks} />
            <SkillBox title="Version Control & CI/CD" skills={versionControl} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
