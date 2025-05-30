import { LanguageSkills } from '@/PortfolioData'

const SkillBox = ({ title, skills }: { title: string, skills: typeof LanguageSkills }) => {
  return (
    <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-white">{title}</h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="w-16 h-16 bg-white/5 backdrop-blur-lg rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110"
          >
            <img src={skill.imgURL} alt="skill" className="w-10 h-10 object-contain" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default SkillBox;