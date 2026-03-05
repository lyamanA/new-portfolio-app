'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import {
  AiOutlineMenu, AiOutlineClose,
  AiOutlineHome, AiOutlineUser,
  AiOutlineCode, AiOutlineFolder, AiOutlineMail
} from 'react-icons/ai';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: t('home'),     href: `/${locale}`,          icon: AiOutlineHome },
    { name: t('about'),    href: `/${locale}/about`,     icon: AiOutlineUser },
    { name: t('skills'),   href: `/${locale}/skills`,    icon: AiOutlineCode },
    { name: t('projects'), href: `/${locale}/projects`,  icon: AiOutlineFolder },
    { name: t('contact'),  href: `/${locale}/contact`,   icon: AiOutlineMail },
  ];

  const switchLang = (lang: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${lang}`);
    router.push(newPath);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled ? 'bg-gradient-to-r from-[#1E0A3C] to-[#0A0216] shadow-xl backdrop-blur-md' : 'bg-transparent'}`}>
      
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Логотип */}
        <Link href={`/${locale}`} className="group flex items-center gap-3 text-2xl font-bold text-white z-50">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#814BF6] to-[#516AF1] shadow-lg shadow-purple-500/20 transition-all duration-300 group-hover:shadow-purple-500/40">
            <span className="text-xl font-extrabold text-white tracking-tighter">{"< >"}</span>
          </div>
          <span className="tracking-tight text-[26px]">DevPortfolio</span>
        </Link>

        {/* Десктоп меню */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href}
              className="flex items-center text-lg text-gray-300 hover:text-white transition duration-300 relative group">
              <item.icon className="mr-2 text-purple-400" />
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}

          {/* Переключатель языков */}
          <div className="flex gap-1 ml-4">
            {['en', 'ru', 'az'].map((lang) => (
              <button key={lang} onClick={() => switchLang(lang)}
                className={`text-xs uppercase px-2 py-1 rounded-md transition-all duration-200
                  ${locale === lang
                    ? 'bg-purple-500/20 text-cyan-400 border border-purple-500/40'
                    : 'text-gray-400 hover:text-white border border-transparent hover:border-white/20'
                  }`}>
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Бургер кнопка */}
        <div className="md:hidden flex items-center z-50">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white text-3xl focus:outline-none">
            {isOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
          </button>
        </div>

        {/* Мобильное меню */}
        {isOpen && (
          <div className="fixed inset-0 bg-gradient-to-b from-[#1E0A3C] to-[#0A0216] z-40 flex flex-col items-center justify-center space-y-8 md:hidden">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}
                className="flex items-center text-3xl text-gray-300 hover:text-white transition duration-300"
                onClick={() => setIsOpen(false)}>
                <item.icon className="mr-3 text-purple-400" />
                {item.name}
              </Link>
            ))}
            {/* Языки в мобильном меню */}
            <div className="flex gap-3 mt-4">
              {['en', 'ru', 'az'].map((lang) => (
                <button key={lang} onClick={() => { switchLang(lang); setIsOpen(false); }}
                  className={`text-sm uppercase px-3 py-2 rounded-md border transition-all
                    ${locale === lang
                      ? 'bg-purple-500/20 text-cyan-400 border-purple-500/40'
                      : 'text-gray-400 border-white/20'
                    }`}>
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}