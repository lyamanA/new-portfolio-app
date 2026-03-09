import AboutSection from "@/components/about";
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  
  return {
    title: `${t('title')} | Lyaman Aslanova`,
    description: t('text'),
  };
}

export default function AboutPage() {
  return (
    <AboutSection />
  );
}