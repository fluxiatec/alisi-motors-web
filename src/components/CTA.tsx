import type { ReactNode } from 'react';
import { WhatsAppIcon } from './icons';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'red' | 'outline' | 'wa';
  className?: string;
  icon?: ReactNode;
};

const styles = {
  red: 'bg-cta text-white active:bg-[#b81414]',
  wa: 'bg-wa text-black active:bg-[#1fb457]',
  outline: 'border border-white/35 text-white active:bg-white/10',
};

/** Botón de llamada a la acción. Los links externos abren en pestaña nueva. */
export function CTA({ href, children, variant = 'red', className = '', icon = <WhatsAppIcon /> }: Props) {
  const external = href.startsWith('http');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener' } : {})}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2.5 rounded-full px-7 text-[0.95rem] font-semibold tracking-wide transition-colors ${styles[variant]} ${className}`}
    >
      {icon}
      {children}
    </a>
  );
}

/** CTA intermedio entre secciones. */
export function InlineCTA({ href, title, label }: { href: string; title?: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-5 px-6 py-14 text-center">
      {title && <p className="title text-3xl sm:text-4xl">{title}</p>}
      <CTA href={href}>{label}</CTA>
    </div>
  );
}
