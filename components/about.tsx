'use client';
import { useTranslations } from 'next-intl';
import ThreeSceneAbout from '@/components/three/ThreeSceneAbout';

export default function AboutSection() {
  const t = useTranslations('about');

  return (
    <section className="min-h-screen bg-[#0d0a1e] relative flex items-center justify-center overflow-hidden">
       
       
       {/* Галактика на фоне */}
      <ThreeSceneAbout />

      

      <div className="absolute inset-0 opacity-10 bg-[#0d0a1e]/60 z-[1]" 
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-6xl font-bold mb-16">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {t('title')}
          </span>
        </h2>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-12" />
        <p className="text-gray-300 text-lg leading-relaxed font-light tracking-wide">{t('text')}</p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-12" />
      </div>
    </section>
  );
}