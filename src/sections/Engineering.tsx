import units from '../data/units.json';
import specs from '../data/specs.json';
import { Reveal } from '../components/Reveal';
import { Counter } from '../components/Counter';
import { Parallax } from '../components/Parallax';

type Stat = { value: number; prefix?: string; suffix?: string; label: string };

export function Engineering() {
  const [shifter, brake, engine] = units.details;

  return (
    <section id="engineering" className="section pt-24 pb-20">
      <div className="px-6 text-center">
        <Reveal as="p" className="eyebrow mb-5">Handmade</Reveal>
        <Reveal as="h2" className="title text-[clamp(3rem,15vw,7rem)]">Engineering</Reveal>
        <Reveal as="p" delay={0.1} className="mx-auto mt-5 max-w-md text-base text-white/70">
          Sculpture in motion.
        </Reveal>
      </div>

      <Parallax photo={engine} className="mt-14 aspect-[4/5] max-h-[90svh] w-full sm:aspect-[16/9]" />

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
          <Parallax key={d.id} photo={d} sizes="50vw" strength={6} className="aspect-[3/4]" />
        ))}
      </div>
    </section>
  );
}
