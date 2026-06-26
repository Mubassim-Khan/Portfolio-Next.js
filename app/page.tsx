import Banner from "@/components/sections/Banner";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import Certifications from "@/components/sections/Certifications";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import FloatingButton from "@/components/layout/FloatingButton";

export default function HomePage() {
  return (
    <>
      <FloatingButton />
      <Banner />
      <Skills />
      <Experience />
      <Projects />
      <Certifications />
      <Contact />
    </>
  );
}
