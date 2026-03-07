'use client';

import { useTranslations } from "next-intl";
import ThreeSceneSkills from '@/components/three/ThreeSceneSkills';

const skills = [
  { name: 'React', icon: '⚛️', level: 90, category: 'Frontend' },
  { name: 'Next.js', icon: '▲', level: 85, category: 'Frontend' },
  { name: 'TypeScript', icon: '🔷', level: 80, category: 'Language' },
  { name: 'Tailwind CSS', icon: '🌊', level: 88, category: 'Styling' },
  { name: 'Node.js', icon: '🟢', level: 75, category: 'Backend' },
  { name: 'PostgreSQL', icon: '🐘', level: 70, category: 'Database' },
  { name: 'Zustand', icon: '🐻', level: 82, category: 'State' },
  { name: 'Git', icon: '🔀', level: 85, category: 'Tools' },
  { name: 'REST API', icon: '🔗', level: 80, category: 'Backend' },
  { name: 'Figma', icon: '🎨', level: 72, category: 'Design' },
  { name: 'Docker', icon: '🐳', level: 60, category: 'DevOps' },
  { name: 'Zod', icon: '✅', level: 78, category: 'Tools' },
  { name: 'Python', icon: '🐍', level: 75, category: 'Language' },
  { name: 'C++', icon: '👾', level: 65, category: 'Language' },    
  { name: 'C#', icon: '🎯', level: 70, category: 'Language' },
  { name: 'MySQL', icon: '🐬', level: 72, category: 'Database' },
];

const categoryColors: Record<string, string> = {
  Frontend: 'from-cyan-500 to-blue-500',
  Language: 'from-blue-500 to-indigo-500',
  Styling: 'from-teal-400 to-cyan-500',
  Backend: 'from-purple-500 to-pink-500',
  Database: 'from-indigo-400 to-purple-500',
  State: 'from-amber-400 to-orange-500',
  Tools: 'from-green-400 to-teal-500',
  Design: 'from-pink-400 to-rose-500',
  DevOps: 'from-sky-400 to-blue-400',
};

export default function Skills() {
  const t = useTranslations('skills');
  return (
    <section className="min-h-screen bg-[#0d0a1e] relative flex flex-col items-center justify-center py-24 overflow-hidden">
      {/* Three.js орбы */}
      <ThreeSceneSkills />

      {/* Плавный переход сверху от about */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[#0d0a1e] to-transparent z-20" />

      {/* Сетка */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: '80px 80px',
      }} />




      {/* Сетка на фоне */}
      {/* <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      /> */}

      {/* Фиолетовое свечение */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-700 opacity-10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl px-6">

       {/* Заголовок и текстовый блок с отступом mb-16 */}
        <div className="text-center mb-16"> 
          <h2 className="text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {t('title')}
            </span>
          </h2>
          
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mb-6" />

          <p className="text-gray-400 text-lg">
            {t('subtitle')}
            {' '} — {' '}
            <span className="text-gray-500">{t('description')}</span>
          </p>
        </div>
        
        {/* Карточки */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {skills.map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
        </div>
      </div>
       {/* Плавный переход вниз */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#0d0a1e] z-20" />
    </section>
  );
}

function SkillCard({ skill }: { skill: typeof skills[0] }) {
  const gradient = categoryColors[skill.category] ?? 'from-purple-500 to-cyan-400';

  return (
    <div className="group relative bg-[#13102a] border border-white/5 rounded-2xl p-5 cursor-default
      transition-all duration-300 ease-out
      hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(139,92,246,0.25)] hover:border-purple-500/30"
    >
      {/* Градиентный блик при наведении */}
      <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

      {/* Иконка */}
      <div className="text-3xl mb-3">{skill.icon}</div>

      {/* Название */}
      <h3 className="text-white font-semibold text-sm mb-1">{skill.name}</h3>

      {/* Категория */}
      <p className="text-gray-500 text-xs mb-3">{skill.category}</p>

      {/* Прогресс бар */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${skill.level}%` }}
        />
      </div>
      <p className="text-right text-gray-500 text-xs mt-1">{skill.level}%</p>
    </div>
  );
}