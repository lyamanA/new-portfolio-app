import Contact from '@/components/contact';
import { getLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  
  return {
    title: `${t('title')} | Lyaman Aslanova`,
    description: t('subtitle'),
  };
} 

export default function ContactPage() {
  return <Contact />;
}
