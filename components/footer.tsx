// components/footer.tsx
'use client';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';



// const navLinks = [
//   { href: '/', label: 'Home' },
//   { href: '/about', label: 'About' },
//   { href: '/skills', label: 'Skills' },
//   { href: '/projects', label: 'Projects' },
//   { href: '/contact', label: 'Contact' },
// ];

export default function Footer() {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const locale = useLocale();

  const navLinks = [
    { href: `/${locale}`,          label: tNav('home') },
    { href: `/${locale}/about`,    label: tNav('about') },
    { href: `/${locale}/skills`,   label: tNav('skills') },
    { href: `/${locale}/projects`, label: tNav('projects') },
    { href: `/${locale}/contact`,  label: tNav('contact') },
  ];

  return (
    <footer className="bg-[#080614] border-t border-white/5 text-white">
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Левая часть — лого + описание */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                DevPortfolio
              </span>
            </div>

             <p className="text-gray-400 text-sm leading-relaxed mb-5 max-w-xs">{t('description')}</p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/5">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {/* Available for Work badge */}
              <span className="text-green-400 text-xs font-medium">{t('available')}</span>
            </div>

            
          </div>

          {/* Средняя часть — навигация */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              {t('navigation')}
            </h4>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 text-sm hover:text-cyan-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Правая часть — соцсети */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">
              {t('connect')}
           </h4>

            <div className="flex gap-3 mb-5">
              {/* GitHub */}
              <a href="https://github.com/lyamanA" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* Twitter/X */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-sky-500/50 hover:bg-sky-500/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Email */}
              <a href="mailto:your@email.com"
                className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-500/10 transition-all duration-300">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>

            <p className="text-gray-500 text-xs leading-relaxed">
               {t('chat')}
            </p>
          </div>
        </div>

        {/* Нижняя полоса */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-gray-500 text-xs flex items-center gap-1.5">
            © 2026 DevPortfolio. Made with
            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            and ☕
          </p>
          <div className="flex items-center gap-4 text-gray-600 text-xs">
            <span>Powered by React & TypeScript</span>
            <span className="w-1 h-1 rounded-full bg-purple-500" />
            <span>Styled with Tailwind CSS</span>
          </div>
        </div>
      </div>
    </footer>
  );
}