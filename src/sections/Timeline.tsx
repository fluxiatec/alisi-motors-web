import { useRef } from 'react';
import { m, useScroll, useTransform } from 'motion/react';
import data from '../data/timeline.json';
import { Reveal } from '../components/Reveal';
import { useReducedMotion } from '../hooks/usePrefs';

/** Timeline vertical: la línea se dibuja con el scroll (scaleY) y cada hito entra con fade. */
export function Timeline() {
  const list = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 80%', 'end 55%'] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="trayectoria" className="section px-6 pt-24 pb-24">
      <div className="text-center">
        <Reveal as="p" className="eyebrow mb-5">Desde 2020</Reveal>
        <Reveal as="h2" className="title text-[clamp(3rem,15vw,7rem)]">Trayectoria</Reveal>
      </div>

      <ol ref={list} className="relative mx-auto mt-16 max-w-xl pl-9">
        <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-white/12" />
        <m.span
          aria-hidden="true"
          className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-red"
          style={reduced ? undefined : { scaleY }}
        />
        {data.events.map((e) => (
          <Reveal as="li" key={e.date + e.text} y={20} className="relative pb-11 last:pb-0">
            <span aria-hidden="true" className="absolute top-[0.45rem] -left-9 h-[11px] w-[11px] rounded-full border-2 border-red bg-black" />
            <p className="font-display text-2xl tracking-wide text-red uppercase">{e.date}</p>
            <p className="mt-1.5 text-[1.02rem] leading-relaxed text-white/85">{e.text}</p>
          </Reveal>
        ))}
      </ol>

      <Reveal className="mx-auto mt-20 max-w-xl border-t border-white/15 pt-10 text-center">
        <p className="font-display text-[clamp(3.5rem,18vw,7rem)] leading-none">{data.highlight.value}</p>
        <p className="mx-auto mt-3 max-w-xs text-base text-white/70">{data.highlight.text}</p>
      </Reveal>
    </section>
  );
}
