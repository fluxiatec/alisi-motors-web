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
/** Diagnóstico en pantalla: abrir la web con ?debug (ej. http://192.168.1.27:4180/?debug). */
const DEBUG = typeof location !== 'undefined' && location.search.includes('debug');
function log(name: string, msg: string) {
  if (!DEBUG) return;
  let box = document.getElementById('video-debug');
  if (!box) {
    box = document.createElement('pre');
    box.id = 'video-debug';
    box.style.cssText =
      'position:fixed;left:0;right:0;top:0;z-index:99;max-height:45vh;overflow:auto;margin:0;padding:8px;background:rgba(0,0,0,.85);color:#0f0;font:11px/1.35 monospace;white-space:pre-wrap';
    document.body.appendChild(box);
    const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    box.textContent =
      `UA: ${navigator.userAgent}\nancho: ${innerWidth}px · saveData: ${c?.saveData} · red: ${c?.effectiveType}\n` +
      `reduced-motion: ${matchMedia('(prefers-reduced-motion: reduce)').matches}\n`;
  }
  box.textContent += `[${(performance.now() / 1000).toFixed(1)}s] ${name}: ${msg}\n`;
}

export function SmartVideo({ name, hero, label, className = '' }: Props) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [manual] = useState(() => saveData() || prefersReducedMotion());
  const [allowed, setAllowed] = useState(!manual);
  useEffect(() => {
    if (manual) log(name, 'modo manual (saveData o reduced-motion): poster + botón "Ver video"');
  }, [manual, name]);
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
    // React no escribe el atributo `muted` en el HTML; iOS Safari lo exige para reproducir sin gesto.
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    log(name, `src ${src}`);
    if (DEBUG)
      for (const ev of ['loadedmetadata', 'canplay', 'playing', 'waiting', 'stalled', 'suspend', 'error'])
        v.addEventListener(ev, () => log(name, ev + (ev === 'error' ? ` code=${v.error?.code} ${v.error?.message ?? ''}` : ` (readyState ${v.readyState})`)));

    let visible = false;
    const tryPlay = () =>
      v.play().then(
        () => log(name, 'play ok'),
        (err: Error) => {
          log(name, `play bloqueado: ${err.name}`);
          // Autoplay bloqueado (ej. modo bajo consumo en iPhone): reintentar con el primer toque del usuario.
          const retry = () => visible && v.play().catch(() => {});
          window.addEventListener('touchstart', retry, { once: true, passive: true });
          window.addEventListener('click', retry, { once: true });
        },
      );
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) tryPlay();
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, name]);

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
          aria-label={`Play video: ${label}`}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path d="M2 1l11 6-11 6z" fill="currentColor" />
          </svg>
          Play video
        </button>
      )}
    </div>
  );
}
