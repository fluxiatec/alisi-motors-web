import units from '../data/units.json';
import specs from '../data/specs.json';
import { Reveal } from '../components/Reveal';
import { Counter } from '../components/Counter';
import { Parallax } from '../components/Parallax';
import { InlineCTA } from '../components/CTA';
import { waLink } from '../lib/contact';

type Stat = { value: number; prefix?: string; suffix?: string; label: string };

export function Engineering() {
  const [shifter, brake, engine] = units.details;
  // Los datos con "pending": true quedan ocultos hasta que el cliente los confirme.
  const sheet = specs.sheet.filter((r) => !('pending' in r && r.pending) && r.value);

  return (
    <section id="ingenieria" className="section pt-24">
      <div className="px-6 text-center">
        <Reveal as="p" className="eyebrow mb-5">Hecho a mano</Reveal>
        <Reveal as="h2" className="title text-[clamp(3rem,15vw,7rem)]">Ingeniería</Reveal>
        <Reveal as="p" delay={0.1} className="mx-auto mt-5 max-w-md text-base text-white/70">
          Escultura en movimiento. Más de 5.700 piezas, ensambladas una por una en nuestra fábrica de Malagueño.
        </Reveal>
      </div>

      <figure className="relative mt-14">
        <Parallax photo={engine} className="aspect-[4/5] max-h-[90svh] w-full sm:aspect-[16/9]" />
        <figcaption className="absolute bottom-5 left-6 font-display text-3xl tracking-wide uppercase">
          <span className="text-red">V8</span> central
        </figcaption>
      </figure>

      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 px-6 py-16 lg:grid-cols-4">
        {(specs.stats as Stat[]).map((s, i) => (
          <Reveal key={s.label} delay={(i % 2) * 0.08} className="flex flex-col-reverse gap-2 border-t border-white/15 pt-4">
            <dt className="text-sm leading-snug text-white/60">{s.label}</dt>
            <dd className="font-display text-[clamp(2.4rem,11vw,4rem)] leading-none">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </dd>
          </Reveal>
        ))}
      </dl>

      <div className="grid grid-cols-2 gap-1.5 px-1.5">
        {[shifter, brake].map((d) => (
          <figure key={d.id} className="relative">
            <Parallax photo={d} sizes="50vw" strength={6} className="aspect-[3/4]" />
            <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
            <figcaption className="absolute bottom-3 left-3 text-xs tracking-[0.2em] text-white/90 uppercase">{d.caption}</figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto max-w-2xl px-6 pt-20">
        <Reveal as="h3" className="title mb-8 text-4xl">Ficha técnica</Reveal>
        <dl className="divide-y divide-white/12 border-y border-white/12">
          {sheet.map((r) => (
            <Reveal key={r.label} y={14} className="grid grid-cols-[7.5rem_1fr] gap-4 py-4 text-[0.95rem] sm:grid-cols-[11rem_1fr]">
              <dt className="text-white/50">{r.label}</dt>
              <dd className="text-white/90">{r.value}</dd>
            </Reveal>
          ))}
        </dl>
      </div>

      <InlineCTA href={waLink(0)} title="Una experiencia de propiedad única" label="Consultá por tu unidad" />
    </section>
  );
}
