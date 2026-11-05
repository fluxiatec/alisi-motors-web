import { Reveal } from '../components/Reveal';

export function Manifesto() {
  return (
    <section id="manifiesto" className="section px-6 pt-10 pb-28 sm:pb-36">
      <div className="mx-auto max-w-2xl">
        <Reveal as="p" className="eyebrow mb-8 text-center">Homenaje a Ken Miles</Reveal>
        <Reveal as="p" className="text-center text-[1.35rem] leading-snug font-light text-white/90 sm:text-3xl">
          En 1966 un GT40 MK1 cambió la historia en Le&nbsp;Mans.
        </Reveal>
        <Reveal as="p" delay={0.1} className="mt-5 text-center text-[1.35rem] leading-snug font-light text-white/90 sm:text-3xl">
          Hoy lo volvemos a construir, pieza por pieza, a mano en Córdoba.
        </Reveal>
        <Reveal as="p" delay={0.2} className="mt-10 text-center font-display text-2xl tracking-wide text-white uppercase sm:text-3xl">
          Viviendo el presente, <span className="text-red">admirando el pasado.</span>
        </Reveal>
      </div>
    </section>
  );
}
