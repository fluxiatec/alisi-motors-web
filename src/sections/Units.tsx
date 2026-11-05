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
    <section id="unidades" className="section pt-24 pb-6">
      <div className="px-6 text-center">
        <Reveal as="p" className="eyebrow mb-5">Mismo modelo · cada una única</Reveal>
        <Reveal as="h2" className="title text-[clamp(3rem,15vw,7rem)]">Las unidades</Reveal>
      </div>

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
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-sm bg-ink text-left"
              aria-label={`Ver fotos del Miles GT40 ${u.color}${u.raceNumber ? ` número ${u.raceNumber}` : ''}`}
            >
              <Picture
                photo={u.photos[0]}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-700 group-active:scale-[1.02]"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <span>
                  <span className="block text-xs tracking-[0.25em] text-white/70 uppercase">{u.color}</span>
                  <span className="mt-1 block text-sm text-white/90">
                    {u.unidad ? `Unidad ${u.unidad}` : 'Miles GT40'} · {u.photos.length} fotos
                  </span>
                </span>
                {u.raceNumber && (
                  <span className="font-display text-6xl leading-none text-white">
                    <span className="text-red">#</span>
                    {u.raceNumber}
                  </span>
                )}
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      <InlineCTA href={waLink(0)} title="Cada vehículo, una creación a medida" label="Quiero mi unidad" />

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
