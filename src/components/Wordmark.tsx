import { useEffect, useState } from 'react';
import { m, useScroll, useTransform } from 'motion/react';
import { prefersReducedMotion } from '../hooks/usePrefs';

type Props = { onIntroDone: () => void };

/**
 * Wordmark fijo (z-0). Las secciones negras lo tapan al pasar y las "ventanas" lo dejan ver.
 * Intro: pantalla negra → fade + tracking → avisa para arrancar el video.
 */
export function Wordmark({ onIntroDone }: Props) {
  const [shown, setShown] = useState(false);
  const { scrollY } = useScroll();
  const taglineOpacity = useTransform(scrollY, [0, 220], [1, 0]);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let done = false;
    const show = () => {
      if (done) return;
      done = true;
      requestAnimationFrame(() => setShown(true));
      window.setTimeout(onIntroDone, reduced ? 0 : 900);
    };
    // Esperar la fuente display (máx. 700 ms) para no animar la tipografía de fallback.
    const t = window.setTimeout(show, 700);
    document.fonts?.load('1em Anton').then(show, show);
    return () => window.clearTimeout(t);
  }, [onIntroDone]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center">
      <div className="relative">
        <p
          className="font-display leading-none whitespace-nowrap text-red select-none"
          style={{
            fontSize: 'var(--wm-size)',
            letterSpacing: shown ? '0em' : '0.03em',
            opacity: shown ? 1 : 0,
            transition: 'opacity 1.1s cubic-bezier(.2,.7,.2,1), letter-spacing 1.6s cubic-bezier(.2,.7,.2,1)',
          }}
        >
          ALISIMOTORS
        </p>
        <m.p
          className="absolute inset-x-0 top-full mt-2 text-center text-[0.8rem] font-medium tracking-[0.42em] text-white uppercase sm:text-sm"
          style={{
            opacity: shown ? taglineOpacity : 0,
            transition: 'opacity 1s 0.5s',
          }}
        >
          Art &amp; Speed
        </m.p>
      </div>
    </div>
  );
}
