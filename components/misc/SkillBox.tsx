import { LanguageSkills } from "@/PortfolioData";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SkillBox = ({
  title,
  skills,
}: {
  title: string;
  skills: typeof LanguageSkills;
}) => {
  return (
    <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl shadow-md flex flex-col h-full">
      {/* fixed min height for title */}
      <h3 className="text-xl font-semibold mb-4 text-white min-h-[50px] flex items-center justify-center text-center">
        {title}
      </h3>

      {/* icons container */}
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        <TooltipProvider>
          {skills.map((skill) => (
            <Tooltip key={skill.id}>
              <TooltipTrigger asChild>
                <div className="w-16 h-16 bg-white/5 backdrop-blur-lg rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110">
                  <img
                    src={skill.imgURL}
                    alt={skill.name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white mb-1"
                side="top"
                align="center"
              >
                <p>{skill.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    </div>
  );
};

export default SkillBox;
