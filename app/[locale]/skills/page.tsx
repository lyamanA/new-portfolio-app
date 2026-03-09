import Skills from '@/components/skills';

import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'skills' });
  
  return {
    title: `${t('title')} | Lyaman Aslanova`,
    description: t('subtitle'),
  };
}


export default function SkillsPage() {
  return <Skills />;
}