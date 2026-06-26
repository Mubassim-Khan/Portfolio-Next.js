"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Dock from "@/components/misc/Dock";
import { Home, Code2, Briefcase, FolderCode, Award, MessageSquare } from "lucide-react";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY + 5) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 5) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const items = [
    { icon: <Home size={18} />, label: "Home", onClick: () => scrollToSection("home") },
    { icon: <Code2 size={18} />, label: "Skills", onClick: () => scrollToSection("skills") },
    { icon: <Briefcase size={18} />, label: "Experience", onClick: () => scrollToSection("experience") },
    { icon: <FolderCode size={18} />, label: "Projects", onClick: () => scrollToSection("project") },
    { icon: <Award size={18} />, label: "Certifications", onClick: () => scrollToSection("certifications") },
    { icon: <MessageSquare size={18} />, label: "Contact", onClick: () => scrollToSection("connect") },
  ];

  return (
    <motion.div
      className="fixed bottom-2 left-0 right-0 z-50 flex justify-center overflow-x-auto"
      animate={{ y: isVisible ? 0 : 120, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <Dock items={items} panelHeight={68} baseItemSize={50} magnification={70} />
    </motion.div>
  );
};

export default Navbar;
