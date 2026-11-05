import { SmartVideo } from '../components/SmartVideo';
import { Reveal } from '../components/Reveal';

export function MateVideo() {
  return (
    <section id="negro-mate" className="section">
      <div className="relative h-svh">
        <SmartVideo name="mate" label="Miles GT40 negro mate con franjas blancas y llantas doradas" className="h-full w-full" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/75" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-14 text-center" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 3.5rem)' }}>
          <Reveal as="p" className="eyebrow mb-4 text-white/70">Negro mate · llantas doradas</Reveal>
          <Reveal as="h2" delay={0.1} className="title text-[clamp(2.6rem,12vw,6rem)]">
            Una silueta que <br />
            cambió la historia
          </Reveal>
        </div>
      </div>
    </section>
  );
}
