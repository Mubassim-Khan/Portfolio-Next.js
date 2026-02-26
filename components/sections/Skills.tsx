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
        {/* 2 Gradient Blob */}
        <div
          className="absolute top-[5rem] -right-48 w-[35rem] h-[35rem] 
         bg-[#5a51c2] rounded-full blur-[120px] opacity-40 -z-30 animate-pulse md:display-none sm:display-none"
        ></div>

        <div
          className="absolute top-[25rem] left-[-10rem] w-[35rem] h-[32rem]
         bg-[#946263] rounded-full blur-[120px] opacity-40 -z-30 animate-pulse md:display-none sm:display-none"
        ></div>

        <div className="relative bg-black/10 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-[65px] text-center px-[50px] py-[60px] -mt-[60px]">
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
