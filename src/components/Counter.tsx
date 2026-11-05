import { useEffect, useRef } from 'react';
import { animate, useInView } from 'motion/react';
import { prefersReducedMotion } from '../hooks/usePrefs';

const fmt = new Intl.NumberFormat('es-AR');

/** Número que cuenta desde 0 al entrar en pantalla. Escribe directo en el DOM (sin re-render). */
export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' });

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const write = (v: number) => (el.textContent = `${prefix}${fmt.format(Math.round(v))}${suffix}`);
    if (prefersReducedMotion()) return void write(value);
    const c = animate(0, value, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: write });
    return () => c.stop();
  }, [inView, value, prefix, suffix]);

  // El valor final queda en el HTML inicial (SEO / sin JS) y se reemplaza al animar.
  return (
    <span ref={ref} className="tabular-nums">
      {`${prefix}${fmt.format(value)}${suffix}`}
    </span>
  );
}
