"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import CertificateCard from "./CertificateCard";
import ShinyText from "./ShinyText";
import BlurText from "./BlurText";
import toast from "react-hot-toast";

type Certification = {
  id: string;
  name: string;
  verifyUrl: string;
  skill: string;
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
                  <CertificateCard key={certificate.id} {...certificate} />
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
