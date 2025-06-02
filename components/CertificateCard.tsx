import CustomButton from "./Button";

interface CertificateCardProps {
    title: string,
    skill: string,
    verifyLink: string
}

const CertificateCard = ({ title, skill, verifyLink }: CertificateCardProps) => {
    return (
        <div className="relative bg-white/5 backdrop-blur-sm rounded-xl shadow-md p-6 w-full max-w-md mx-auto border-white/10 hover:shadow-lg transition text-center min-h-[260px]">
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-md text-gray-300 mb-4 mt-4">
                Skill: <span className="font-medium">{skill}</span>
            </p>
            <div className="absolute left-0 right-0 bottom-10 flex justify-center">
                <CustomButton
                    Url={verifyLink}
                    text="Verify Certificate"
                />
            </div>
        </div>
    )
}

export default CertificateCard;