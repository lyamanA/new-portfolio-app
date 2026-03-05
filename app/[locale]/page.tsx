import AboutSection from "@/components/about";
import Hero from "@/components/hero";
import Navbar from "@/components/navabr";
import SkillsPage from "./skills/page";
import ProjectsPage from "./projects/page";
import Contact from "@/components/contact";

export default function Home() {
  return (
   <>
   <Navbar />
   <Hero />
   <AboutSection />
   <SkillsPage />
   <ProjectsPage />
   <Contact />
   </>
  );
}
