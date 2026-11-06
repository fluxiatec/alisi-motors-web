import { Reveal } from '../components/Reveal';

export function Manifesto() {
  return (
    <section id="manifesto" className="section px-6 pt-24 pb-28 sm:pt-32 sm:pb-36">
      <div className="mx-auto max-w-2xl">
        <Reveal as="p" className="eyebrow mb-8 text-center">Homage to Ken Miles</Reveal>
        <Reveal as="p" className="text-center text-[1.35rem] leading-snug font-light text-white/90 sm:text-3xl">
          In 1966, a GT40 MK1 changed history at Le&nbsp;Mans.
        </Reveal>
        <Reveal as="p" delay={0.15} className="mt-10 text-center font-display text-2xl tracking-wide text-white uppercase sm:text-3xl">
          Living the present, <span className="text-red">admiring the past.</span>
        </Reveal>
      </div>
    </section>
  );
}
