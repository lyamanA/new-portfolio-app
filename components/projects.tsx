'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import ProjectCard from './ui/ProjectCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5555/api';

interface DBProject {
  _id: string;
  title: { az: string; en: string; ru: string };
  description: { az: string; en: string; ru: string };
  image?: string;
  github?: string;
  demo?: string;
  video?: string;
  tags: string[];
}

const staticProjectsData = [
  {
    titleKey: 'project1Title', 
    descKey: 'project1Desc',
    image: '/project-1.png', 
    tags: ['React native', 'Node.js', 'MongoDB', 'Stripe'],
    github: 'https://github.com/lyamanA/my-app.git', 
    demo: null, 
    //'/projects/virtualGalaxyExplorer.mp4'
    video: null,
  },
  {
    titleKey: 'project2Title', 
    descKey: 'project2Desc',
    image: '/project-2.png',
    tags: ['C#', 'ASP.NET', 'Entity Framework', 'SQL Server'],
    github: 'https://github.com/lyamanA/E-Commerce-User.git', 
    demo: null, 
    video: null,
  },
  {
    titleKey: 'project3Title', 
    descKey: 'project3Desc',
    image: '/project-3.png', 
    tags: ['Next.js', 'TypeScript', 'Tailwind', 'Zustand'],
    github: 'https://github.com/lyamanA/new-portfolio-app.git', 
    demo: null, 
    video: null,
  },
];

export default function Projects() {
  const t = useTranslations('projects');
  const locale = useLocale() as 'az' | 'en' | 'ru';
  const [dbProjects, setDbProjects] = useState<DBProject[]>([]);

  useEffect(() => {
    fetch(`${API}/projects`)
      .then(res => res.json())
      .then(data => setDbProjects(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Статичные проекты из json переводов
  const staticProjects = staticProjectsData.map(p => ({
    title: t(p.titleKey),
    description: t(p.descKey),
    image: p.image,
    tags: p.tags,
    github: p.github,
    demo: p.demo,
    video: p.video,
  }));

  // Динамические проекты из MongoDB
  const dynamicProjects = dbProjects.map(p => ({
    title: p.title[locale],
    description: p.description[locale],
    image: p.image || '/project-1.png',
    tags: p.tags,
    github: p.github || null,
    demo: p.demo || null,
    video: p.video || null,
  }));

  // Объединяем — сначала статичные, потом из БД
  const allProjects = [...staticProjects, ...dynamicProjects];

  return (
    <section className="min-h-screen bg-[#0d0a1e] relative flex flex-col items-center justify-center py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-700 opacity-10 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-6">
        <div className="text-center mb-4">
          <h2 className="text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-cyan-400 mx-auto mb-4 rounded-full" />
          <p className="text-gray-400 text-base">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {allProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        <div className="flex justify-center mt-14">
          <a href="https://github.com/lyamanA" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold text-sm hover:opacity-90 hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(139,92,246,0.4)]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            {t('github')}
          </a>
        </div>
      </div>
    </section>
  );
}