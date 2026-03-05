// components/ui/ProjectCard.tsx
'use client';

import { useState } from 'react';
import VideoModal from './VideoModal';
import { AiOutlinePlayCircle } from 'react-icons/ai';

// Вам нужно будет импортировать 'projectsData' из Projects.tsx или определить его здесь,
// если вы хотите, чтобы ProjectCard был полностью самодостаточным.
// Для простоты, допустим, projectsData передается через пропсы, как в вашем Projects.tsx.
interface Project {
  title: string;
  description: string;
  image: string | null;
  tags: string[];
  github: string | null;
  demo: string | null; // Теперь может быть null
  video: string | null;
}

export default function ProjectCard({ project }: { project: Project }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  return (
    <div className="group bg-[#13102a] border border-white/5 rounded-2xl overflow-hidden
      transition-all duration-300 hover:-translate-y-3 hover:shadow-[0_20px_40px_rgba(139,92,246,0.2)] hover:border-purple-500/30"
    >
      {/* Превью — картинка */}
      <div className="relative w-full h-48 bg-[#1a1535] overflow-hidden">
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          // Заглушка, если нет картинки
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <svg className="w-12 h-12 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
              <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
              <path strokeWidth="1.5" d="M21 15l-5-5L5 21" />
            </svg>
            <span className="text-white/20 text-xs">Add image or video</span>
          </div>
        )}

        {/* Оверлей с кнопками при наведении */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          
          {/* Кнопка "Watch Video" */}
          {project.video && (
            <button
              onClick={() => setShowVideoModal(true)}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-cyan-400 text-white text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
            >
              <AiOutlinePlayCircle className="text-sm" /> Watch Video
            </button>
          )}

          {/* Кнопка "GitHub" */}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              GitHub
            </a>
          )}
          
          {/* Кнопка "Live Demo" - появляется только если есть ссылка */}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-medium hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Контент */}
      <div className="p-5">
        <h3 className="text-white font-bold text-lg mb-2">{project.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.description}</p>

        {/* Теги */}
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full border border-purple-500/30 text-cyan-400 text-xs font-medium bg-purple-500/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Модальное окно для видео */}
      {showVideoModal && project.video && (
        <VideoModal videoSrc={project.video} onClose={() => setShowVideoModal(false)} />
      )}
    </div>
  );
}