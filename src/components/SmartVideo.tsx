import { useEffect, useRef, useState } from 'react';
import { posterUrl, videoUrl } from '../lib/media';
import { prefersReducedMotion, saveData } from '../hooks/usePrefs';

type Props = {
  name: string;
  /** Hero: preload="metadata" y poster con prioridad alta (LCP). */
  hero?: boolean;
  label: string;
  className?: string;
};

/**
 * Video muteado en loop. Fuente según ancho de pantalla, reproduce solo en viewport.
 * Con saveData o prefers-reduced-motion muestra el poster y un botón de play.
 */
export function SmartVideo({ name, hero, label, className = '' }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const [manual] = useState(() => typeof window !== 'undefined' && (saveData() || prefersReducedMotion()));
  const [allowed, setAllowed] = useState(!manual);
  const [src, setSrc] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);

  // Elegir fuente (evita bajar el 1080 en celulares).
  useEffect(() => {
    if (!allowed) return;
    const big = window.innerWidth >= 900;
    setSrc(videoUrl(name, big ? 1080 : 720));
  }, [allowed, name]);

  // Reproducir solo en pantalla.
  useEffect(() => {
    const v = ref.current;
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
    <div className={`relative overflow-hidden bg-black ${className}`}>
      {/* El poster como <img> real: es el candidato a LCP del hero. */}
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        width={720}
        height={1280}
        fetchPriority={hero ? 'high' : 'auto'}
        loading={hero ? 'eager' : 'lazy'}
        decoding={hero ? 'sync' : 'async'}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {src && (
        <video
          ref={ref}
          src={src}
          poster={poster}
          muted
          playsInline
          loop
          autoPlay={!manual}
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
          className="absolute bottom-6 left-1/2 z-20 flex min-h-11 -translate-x-1/2 items-center gap-2 rounded-full border border-white/40 bg-black/50 px-5 text-sm tracking-wide text-white backdrop-blur"
          aria-label={`Reproducir video: ${label}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M2 1l11 6-11 6z" fill="currentColor" /></svg>
          Ver video
        </button>
      )}
    </div>
  );
}
