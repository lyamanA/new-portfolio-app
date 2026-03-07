'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import ThreeScene from '@/components/three/ThreeScene';


export default function Hero() {
  const t = useTranslations('hero');
  const locale = useLocale();
  const roleText = t('role');
  const myName = t('name');

  const [displayedText, setDisplayedText] = useState('');
  const [index, setIndex] = useState(0);

  // Сбрасываем анимацию при смене языка
  useEffect(() => {
    setDisplayedText('');
    setIndex(0);
  }, [roleText]);

  useEffect(() => {
    if (index < roleText.length) {
      const id = setTimeout(() => {
        setDisplayedText((prev) => prev + roleText[index]);
        setIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(id);
    }
  }, [index, roleText]);

  return (
    <section className="min-h-screen bg-[#0d0a14] relative overflow-hidden flex items-center">
       {/* Three.js частицы как фон */}
      <ThreeScene />
      <div className="absolute right-0 top-0 w-[600px] h-full bg-purple-600 opacity-30 blur-[120px] rounded-full" />

      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between relative z-10 py-20 md:py-0">

        <div className="max-w-xl text-center md:text-left">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
            {t('greeting')} <span className="text-white">{myName}</span>
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-6 min-h-[48px] md:min-h-[60px]">
            {displayedText}
            <span className="animate-pulse inline-block w-1 bg-cyan-400 ml-1 h-8 md:h-10" />
          </h2>
          <p className="text-gray-400 text-base leading-relaxed mb-8 max-w-md mx-auto md:mx-0">
            {t('description')}
          </p>
          <Link href={`/${locale}/contact`}
            className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white font-semibold hover:opacity-90 transition-opacity">
            {t('button')}
          </Link>
        </div>

        <div className="mt-10 md:mt-0 relative flex justify-center">
          <div className="w-[320px] h-[400px] rounded-2xl bg-gradient-to-b from-purple-700 to-transparent flex items-end justify-center overflow-hidden border-2 border-purple-500 shadow-lg">
            <span className="text-white/30 mb-4 text-sm">my photo here</span>
          </div>
        </div>

      </div>
      {/* Плавный переход вниз */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0d0a1e] z-20" />
    </section>
  );
}