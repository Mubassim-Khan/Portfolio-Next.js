interface CertificateCardProps {
    title: string,
    skill: string,
    verifyLink: string
}

const CertificateCard = ({ title, skill, verifyLink }: CertificateCardProps) => {
    return (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-md p-6 w-full max-w-md mx-auto border-white/10 hover:shadow-lg transition text-center">
            <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
            <p className="text-md text-gray-300 mb-4 mt-4">
                Skill: <span className="font-medium">{skill}</span>
            </p>
            <a
                href={verifyLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 px-4 rounded transition no-underline"
            >
                Verify Certificate
            </a>
        </div>
    )
}

export default CertificateCard;