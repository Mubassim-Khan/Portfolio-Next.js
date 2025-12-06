import Banner from "@/components/Banner";
import Skills from "@/components/Skills";
import Certifications from "@/components/Certifications";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import FloatingButton from "@/components/FloatingButton";

export default function HomePage() {
  return (
    <>
      <FloatingButton />
      <Banner />
      <Skills />
      <Projects />
      <Certifications />
      <Contact />
    </>
  );
}
