import { LanguageSkills } from "@/PortfolioData";
import SkillBox from "../misc/SkillBox";
import ShinyText from "../misc/ShinyText";
import BlurText from "../misc/BlurText";
import BorderGlow from "../misc/BorderGlow";

const Skills = () => {
  const languages = LanguageSkills.slice(0, 4);
  const frameworks = LanguageSkills.slice(4, 11);
  const databases = LanguageSkills.slice(11, 18);
  const cssFrameworks = LanguageSkills.slice(18, 21);
  const devOps = LanguageSkills.slice(21, 24);
  const machineLearning = LanguageSkills.slice(24, 26);

  return (
    <section
      className="skill relative -mt-px w-full py-16"
      id="skills"
    >
      {/* Ambient glow: clipped to the section and faded in from the top edge so it blends flush with the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent_0,black_320px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_320px)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(76,201,240,0.13),_transparent_48%)]" />
        <div className="relative mx-auto h-full max-w-[1140px]">
          <div className="absolute top-0 -right-48 hidden h-[35rem] w-[35rem] animate-pulse rounded-full bg-[#5a51c2] opacity-30 blur-[150px] lg:block" />
          <div className="absolute top-[20rem] -left-48 hidden h-[32rem] w-[35rem] animate-pulse rounded-full bg-[#946263] opacity-30 blur-[150px] lg:block" />
        </div>
      </div>

      <div className="max-w-[1140px] mx-auto px-4 relative z-10">
        <div className="relative bg-black/10 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.15)] rounded-[40px] text-center px-4 md:px-[50px] py-[60px]">
          <div className="text-[32px] md:text-[50px] font-bold text-center">
            <BlurText
              text="Skills"
              delay={250}
              animateBy="words"
              direction="top"
              className="!text-[32px] md:!text-[50px] font-bold text-center !text-[#fff] !mb-[0px]"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <BorderGlow borderRadius={16} fillOpacity={0} className="h-full">
              <SkillBox title="Languages" skills={languages} />
            </BorderGlow>
            <BorderGlow borderRadius={16} fillOpacity={0} className="h-full">
              <SkillBox title="Libraries & Frameworks" skills={frameworks} />
            </BorderGlow>
            <BorderGlow borderRadius={16} fillOpacity={0} className="h-full">
              <SkillBox title="Databases & ORMs" skills={databases} />
            </BorderGlow>
            <BorderGlow borderRadius={16} fillOpacity={0} className="h-full">
              <SkillBox title="Styling & UI Libraries" skills={cssFrameworks} />
            </BorderGlow>
            <BorderGlow borderRadius={16} fillOpacity={0} className="h-full">
              <SkillBox title="DevOps & Version Control" skills={devOps} />
            </BorderGlow>
            <BorderGlow borderRadius={16} fillOpacity={0} className="h-full">
              <SkillBox title="Computer Vision" skills={machineLearning} />
            </BorderGlow>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
