import { useEffect } from 'react';
import { prefersReducedMotion } from '../hooks/usePrefs';

/** Momento (ms desde la navegación) en que el wordmark terminó de aparecer: ver .wm__word en index.html. */
const INTRO_MS = 1000;

/**
 * El wordmark vive en index.html (pinta antes que el JS). Este hook:
 * - avisa cuándo terminó la intro para abrir la cortina del video;
 * - desvanece "Art & Speed" al scrollear (solo opacity).
 */
export function useWordmark(onIntroDone: () => void) {
  useEffect(() => {
    const wait = prefersReducedMotion() ? 0 : Math.max(0, INTRO_MS - performance.now());
    const t = window.setTimeout(onIntroDone, wait);

    const tag = document.getElementById('wm-tag');
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!tag) return;
        const o = Math.max(0, 1 - window.scrollY / 220);
        // Tras la animación de entrada, el inline style manda.
        tag.style.animation = 'none';
        tag.style.opacity = String(o);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [onIntroDone]);
}
