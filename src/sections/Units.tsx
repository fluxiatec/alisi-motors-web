import { lazy, Suspense, useRef, useState } from 'react';
import data from '../data/units.json';
import { Picture } from '../components/Picture';
import { Reveal } from '../components/Reveal';
import { InlineCTA } from '../components/CTA';
import { waLink, type Unit } from '../lib/contact';

// Embla + lightbox se cargan recién al tocar una card.
const Lightbox = lazy(() => import('../components/Lightbox'));
const preloadLightbox = () => void import('../components/Lightbox');

export function Units() {
  const [open, setOpen] = useState<Unit | null>(null);
  const lastCard = useRef<HTMLButtonElement | null>(null);

  return (
    <section id="units" className="section pt-24 pb-6">
      <Reveal as="h2" className="title px-6 text-center text-[clamp(2.6rem,12.5vw,6rem)]">
        No two Miles&nbsp;GT40
        <br />
        are alike
      </Reveal>

      <ul className="mx-auto mt-12 grid max-w-7xl gap-3 px-3 sm:grid-cols-2 sm:gap-4 sm:px-6 lg:grid-cols-3">
        {data.units.map((u, i) => (
          <Reveal as="li" key={u.id} delay={(i % 3) * 0.08} y={36}>
            <button
              type="button"
              onClick={(e) => {
                lastCard.current = e.currentTarget;
                setOpen(u);
              }}
              onPointerEnter={preloadLightbox}
              onTouchStart={preloadLightbox}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-ink"
              aria-label={`View photos: ${u.photos[0].alt}`}
            >
              <Picture
                photo={u.photos[0]}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 group-active:scale-[1.02]"
              />
            </button>
          </Reveal>
        ))}
      </ul>

      <InlineCTA href={waLink(0)} label="Contact" />

      {open && (
        <Suspense fallback={null}>
          <Lightbox
            unit={open}
            onClose={() => {
              setOpen(null);
              lastCard.current?.focus({ preventScroll: true });
            }}
          />
        </Suspense>
      )}
    </section>
  );
}
