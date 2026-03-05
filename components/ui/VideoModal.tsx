'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface VideoModalProps {
  videoSrc: string;
  onClose: () => void;
}

export default function VideoModal({ videoSrc, onClose }: VideoModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Portal — монтируем только на клиенте
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    resetHideTimer();
    return () => { if (hideTimer.current) clearTimeout(hideTimer.current); };
  }, [resetHideTimer]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') { e.preventDefault(); togglePlay(); }
      if (e.key === 'ArrowRight') skip(10);
      if (e.key === 'ArrowLeft') skip(-10);
      if (e.key === 'm') toggleMute();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setIsPlaying(true); }
    else { v.pause(); setIsPlaying(false); setShowControls(true); }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleVolume = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const handleProgress = (val: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = (val / 100) * duration;
  };

  const skip = (sec: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(v.currentTime + sec, 0), duration);
  };

  const toggleFullscreen = () => {
    const el = modalRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!mounted) return null;

  // createPortal — рендерит прямо в document.body, поверх всего
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.3)]"
        onMouseMove={resetHideTimer}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {/* Кнопка закрыть */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Видео */}
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          playsInline
          className="w-full aspect-video object-contain cursor-pointer"
          onClick={togglePlay}
          onTimeUpdate={() => {
            const v = videoRef.current;
            if (!v) return;
            setCurrentTime(v.currentTime);
            setProgress((v.currentTime / v.duration) * 100 || 0);
          }}
          onLoadedMetadata={() => {
            const v = videoRef.current;
            if (v) setDuration(v.duration);
          }}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onEnded={() => { setIsPlaying(false); setShowControls(true); }}
        />

        {/* Буферинг */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-12 h-12 border-4 border-white/20 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Большая кнопка Play */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={togglePlay}>
            <div className="w-20 h-20 rounded-full bg-white/10 border border-white/30 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-all duration-300">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Панель управления */}
        <div className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
          <div className="relative px-4 pb-4 pt-8">
            {/* Прогресс бар */}
            <div className="mb-3 group/progress">
              <input
                type="range" min={0} max={100} value={progress}
                onChange={e => handleProgress(Number(e.target.value))}
                className="w-full h-1 appearance-none rounded-full cursor-pointer accent-purple-500"
                style={{ background: `linear-gradient(to right, #a855f7 ${progress}%, rgba(255,255,255,0.2) ${progress}%)` }}
              />
            </div>
            {/* Кнопки */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => skip(-10)} className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/></svg>
                </button>
                <button onClick={togglePlay} className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all">
                  {isPlaying
                    ? <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  }
                </button>
                <button onClick={() => skip(10)} className="text-white/70 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z"/></svg>
                </button>
                <div className="flex items-center gap-2 group/vol">
                  <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors">
                    {isMuted || volume === 0
                      ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16.5 12A4.5 4.5 0 0014 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0017 19.73L19.73 22.5 21 21.23l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
                      : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>
                    }
                  </button>
                  <input type="range" min={0} max={1} step={0.05} value={isMuted ? 0 : volume}
                    onChange={e => handleVolume(Number(e.target.value))}
                    className="w-0 group-hover/vol:w-20 overflow-hidden transition-all duration-300 accent-purple-500 cursor-pointer"
                  />
                </div>
                <span className="text-white/60 text-xs font-mono">{fmt(currentTime)} / {fmt(duration)}</span>
              </div>
              <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors">
                {isFullscreen
                  ? <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>
                  : <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}