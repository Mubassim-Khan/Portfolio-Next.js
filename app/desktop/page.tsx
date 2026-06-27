import Banner from "@/components/desktop/sections/Banner";
import Skills from "@/components/desktop/sections/Skills";
import Experience from "@/components/desktop/sections/Experience";
import Certifications from "@/components/desktop/sections/Certifications";
import Projects from "@/components/desktop/sections/Projects";
import Contact from "@/components/desktop/sections/Contact";
import FloatingButton from "@/components/desktop/layout/FloatingButton";

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
