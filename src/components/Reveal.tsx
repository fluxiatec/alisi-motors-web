import type { ReactNode } from 'react';
import { m } from 'motion/react';

type Props = { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'p' | 'h2' | 'h3' | 'li' };

/** Fade + slide al entrar en viewport. Solo anima transform y opacity. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: Props) {
  const C = m[as];
  return (
    <C
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, delay, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {children}
    </C>
  );
}
