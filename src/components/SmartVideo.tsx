import { useEffect, useRef, useState } from 'react';
import { posterUrl, videoUrl } from '../lib/media';
import { prefersReducedMotion, saveData } from '../hooks/usePrefs';

type Props = {
  name: string;
  /** Hero: carga enseguida (preload="metadata") y poster con prioridad alta. */
  hero?: boolean;
  label: string;
  className?: string;
};

/**
 * Video muteado en loop. Fuente según ancho de pantalla (720p en celulares).
 * - No usa el atributo autoplay (anula preload="none"): reproduce/pausa con IntersectionObserver.
 * - Fuera del hero, el src recién se asigna cuando el video está cerca del viewport.
 * - Con saveData o prefers-reduced-motion: solo poster + botón "Ver video".
 */
export function SmartVideo({ name, hero, label, className = '' }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [manual] = useState(() => saveData() || prefersReducedMotion());
  const [allowed, setAllowed] = useState(!manual);
  const [near, setNear] = useState(!!hero);
  const [playing, setPlaying] = useState(false);

  // Cargar cuando falta ~1 pantalla para llegar.
  useEffect(() => {
    if (near || !box.current) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '100% 0px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, [near]);

  const src = allowed && near ? videoUrl(name, window.innerWidth >= 900 ? 1080 : 720) : null;

  // Reproducir solo en pantalla.
  useEffect(() => {
    const v = video.current;
    if (!v || !src) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src]);

  const poster = posterUrl(name);

  return (
    <div ref={box} className={`relative overflow-hidden bg-black ${className}`}>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        width={720}
        height={1280}
        fetchPriority={hero ? 'high' : 'auto'}
        loading={hero ? 'eager' : 'lazy'}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {src && (
        <video
          ref={video}
          src={src}
          poster={poster}
          muted
          playsInline
          loop
          preload={hero ? 'metadata' : 'none'}
          aria-label={label}
          onPlaying={() => setPlaying(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {!allowed && (
        <button
          type="button"
          onClick={() => setAllowed(true)}
          className={`absolute left-1/2 z-20 flex min-h-11 -translate-x-1/2 items-center ${hero ? 'top-[calc(env(safe-area-inset-top)+1.25rem)]' : 'top-1/3'} gap-2 rounded-full border border-white/40 bg-black/50 px-5 text-sm tracking-wide text-white backdrop-blur`}
          aria-label={`Reproducir video: ${label}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 1l11 6-11 6z" fill="currentColor" />
          </svg>
          Ver video
        </button>
      )}
    </div>
  );
}
