// import AboutSection from "@/components/about";
// import Hero from "@/components/hero";
// import Navbar from "@/components/navabr";
// import SkillsPage from "./skills/page";
// import ProjectsPage from "./projects/page";
// import Contact from "@/components/contact";

// export default function Home() {
//   return (
//    <>
//    <Navbar />
//    <Hero />
//    <AboutSection />
//    <SkillsPage />
//    <ProjectsPage />
//    <Contact />
//    </>
//   );
// }

import AboutSection from "@/components/about";
import Hero from "@/components/hero";
import Navbar from "@/components/navabr";
import SkillsPage from "./skills/page";
import ProjectsPage from "./projects/page";
import Contact from "@/components/contact";
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'hero' });
  
  return {
    title: 'Lyaman Aslanova | Portfolio',
    description: t('description'),
    keywords: ['Next.js', 'TypeScript', 'React', 'Frontend Developer', 'Portfolio'],
    openGraph: {
      title: 'Lyaman Aslanova | Portfolio',
      description: t('description'),
      url: 'https://lyaman-new-portfolio-app.vercel.app',
      siteName: 'Lyaman Aslanova Portfolio',
      locale: locale,
      type: 'website',
    },
  };
}

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
