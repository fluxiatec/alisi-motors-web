import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../hooks/usePrefs';

const fmt = new Intl.NumberFormat('en-US');
const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Número que cuenta desde 0 al entrar en pantalla. rAF + IntersectionObserver, sin re-render.
 * El valor final ya está en el HTML (sin JS / lectores de pantalla).
 */
export function Counter({ value, prefix = '', suffix = '', duration = 1600 }: { value: number; prefix?: string; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const final = `${prefix}${fmt.format(value)}${suffix}`;

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let raf = 0;
    const write = (v: number) => (el.textContent = `${prefix}${fmt.format(Math.round(v))}${suffix}`);
    write(0);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const t = Math.min((now - t0) / duration, 1);
          write(value * easeOutExpo(t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: '0px 0px -15% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, prefix, suffix, duration]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={final}>
      {final}
    </span>
  );
}
