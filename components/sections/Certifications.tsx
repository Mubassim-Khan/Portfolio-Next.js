"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

import CertificateCard from "../cards/CertificateCard";
import ShinyText from "../misc/ShinyText";
import BlurText from "../misc/BlurText";
import toast from "react-hot-toast";

type Certification = {
  id: string;
  name: string;
  verifyUrl: string;
  skill: string;
};

const SpotlightCard = ({ children }: { children: React.ReactNode }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className="relative"
    >
      <div
        className="pointer-events-none absolute -inset-2 rounded-xl transition-opacity duration-500"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(168,85,247,0.12), transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
};

const Certifications = () => {
  const [certification, setCertification] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/certifications");
        if (!res.ok) {
          toast.error("Failed to fetch certifications");
          return;
        }
        const data = await res.json();
        setCertification(data);
      } catch (err) {
        console.error("Error fetching certifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertifications();
  }, []);
  return (
    <section id="certifications" className="certifications">
      <div className="max-w-7xl mx-auto px-4">
        <div className="w-full">
          {/* Gradient Blob */}
          <div className="absolute bottom-[70rem] left-[-25rem] w-[60rem] h-[30rem] bg-[#947a62] rounded-full blur-[100px] opacity-40 -z-10 translate-y-[80%] animate-pulse md:display-none sm:display-none"></div>

          <div className="pb-[50px] relative">
            <div className="text-[45px] font-bold text-center">
              <BlurText
                text="Certifications"
                delay={250}
                animateBy="words"
                direction="top"
                className="text-[50px] font-bold text-center"
              />
            </div>
            <div className="text-center font-[500] text-[#B8B8B8] text-[18px] tracking-[0.8px] leading-[1.5em] my-[14px] mt-[15px] mb-[75px]">
              <ShinyText
                text="Certifications that validate my skills and knowledge in the field"
                disabled={false}
                speed={3}
                className="custom-class"
              />
            </div>
            <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
              {loading ? (
                <div className="w-full flex justify-center py-10">
                  <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
                </div>
              ) : certification.length === 0 ? (
                <p className="w-full text-center text-gray-500">
                  No projects found.
                </p>
              ) : (
                certification.map((certificate) => (
                  <SpotlightCard key={certificate.id}>
                    <CertificateCard {...certificate} />
                  </SpotlightCard>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
