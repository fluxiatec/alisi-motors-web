import { SmartVideo } from '../components/SmartVideo';
import { Reveal } from '../components/Reveal';

export function MateVideo() {
  return (
    <section id="matte-black" className="section">
      <div className="relative h-svh">
        <SmartVideo name="mate" label="Matte black Miles GT40 with white stripes and gold wheels" className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
        <div className="absolute inset-x-0 bottom-0 px-6 text-center" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 3.5rem)' }}>
          <Reveal as="p" className="eyebrow mb-4 text-white/70">Matte black · gold wheels</Reveal>
          <Reveal as="h2" delay={0.1} className="title text-[clamp(2.6rem,12vw,6rem)]">
            A silhouette that <br />
            changed history
          </Reveal>
        </div>
      </div>
    </section>
  );
}
