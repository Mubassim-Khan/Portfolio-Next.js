"use client";

import React, { useRef, useState } from "react";
import CustomButton from "./Button";

interface CertificateCardProps {
    title: string,
    skill: string,
    verifyLink: string
}

const CertificateCard = ({ title, skill, verifyLink }: CertificateCardProps) => {
    const [transformStyle, setTransformStyle] = useState<string>("");
    const cardRef = useRef<HTMLDivElement | null>(null);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const { left, top, width, height } = cardRef.current.getBoundingClientRect();
        const relativeX = (event.clientX - left) / width;
        const relativeY = (event.clientY - top) / height;

        const tiltX = (relativeY - 0.5) * 5;
        const tiltY = (relativeX - 0.5) * -5;

        const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1, 1, 1)`;
        setTransformStyle(newTransform);
    };

    const handleMouseLeave = () => {
        setTransformStyle("");
    };
    return (
        <div
            ref={cardRef}
            className="relative bg-white/5 backdrop-blur-sm rounded-xl shadow-md p-6 w-full max-w-md mx-auto border-white/10 hover:shadow-lg transition text-center min-h-[260px]"
            style={{ transform: transformStyle, transition: "transform 0.2s cubic-bezier(.03,.98,.52,.99)" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
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