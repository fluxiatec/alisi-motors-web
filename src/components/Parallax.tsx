import { useRef } from 'react';
import { m, useScroll, useTransform } from 'motion/react';
import { Picture, type Photo } from './Picture';
import { useReducedMotion } from '../hooks/usePrefs';

type Props = { photo: Photo; className?: string; sizes?: string; strength?: number };

/** Foto grande con parallax suave (solo transform). */
export function Parallax({ photo, className = '', sizes = '100vw', strength = 8 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <m.div className="absolute inset-[-10%_0]" style={reduced ? undefined : { y }}>
        <Picture photo={photo} sizes={sizes} className="h-full w-full object-cover" />
      </m.div>
    </div>
  );
}
