import site from '../data/site.json';
import { Reveal } from '../components/Reveal';

/** Franja de partners. Oculta hasta que el cliente apruebe (site.json → showPartners). */
export function Partners() {
  if (!site.showPartners) return null;
  return (
    <section id="partners" className="section border-y border-white/10 px-6 py-14">
      <Reveal as="p" className="eyebrow mb-8 text-center">Nos acompañan</Reveal>
      <ul className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4">
        {site.partners.map((p) => (
          <li key={p} className="font-display text-lg tracking-wide text-white/60 uppercase">
            {p}
          </li>
        ))}
      </ul>
    </section>
  );
}
