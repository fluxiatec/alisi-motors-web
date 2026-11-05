import { Reveal } from '../components/Reveal';

export function Only24() {
  return (
    <section id="solo-24" className="section px-6 pt-24 pb-16 text-center sm:pt-32">
      <Reveal as="p" className="eyebrow mb-6">Miles GT40 · Serie limitada</Reveal>
      <Reveal as="h2" className="title text-[clamp(3.5rem,19vw,11rem)]">
        Sólo existen <span className="text-red">24.</span>
      </Reveal>
      <Reveal as="p" delay={0.15} className="mx-auto mt-6 max-w-sm text-base text-white/70">
        Unidades numeradas, de la 01/24 a la 24/24. Cada vehículo, una creación a medida.
      </Reveal>
    </section>
  );
}
