import Projects from "@/components/projects";

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'projects' });
  
  return {
    title: `${t('title')} | Lyaman Aslanova`,
    description: t('subtitle'),
  };
}

export default function ProjectsPage() {
  return (
    <Projects />
  );
}