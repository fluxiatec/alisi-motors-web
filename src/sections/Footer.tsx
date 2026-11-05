import { Isotipo } from '../components/icons';
import { contact } from '../lib/contact';

export function Footer() {
  return (
    <footer className="section border-t border-white/10 px-6 pt-12 text-center" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 2.5rem)' }}>
      <Isotipo className="mx-auto h-9 text-red" />
      <p className="mt-4 font-display text-xl tracking-[0.18em] uppercase">Alisi Motors</p>
      <p className="mt-1 text-xs tracking-[0.35em] text-white/50 uppercase">Art &amp; Speed</p>
      <nav className="mt-7 flex flex-wrap justify-center gap-x-6 text-sm text-white/70" aria-label="Redes y contacto">
        <a href={contact.instagram.url} target="_blank" rel="noopener" className="inline-flex min-h-11 items-center">
          Instagram {contact.instagram.handle}
        </a>
        <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center">
          {contact.email}
        </a>
      </nav>
      <p className="mt-6 text-xs text-white/55">© {new Date().getFullYear()} Alisi Motors · Malagueño, Córdoba, Argentina</p>
    </footer>
  );
}
