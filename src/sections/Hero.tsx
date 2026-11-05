import { SmartVideo } from '../components/SmartVideo';
import { CTA } from '../components/CTA';
import { waLink } from '../lib/contact';

/**
 * Hero: el video va en z-[-1] (por debajo del wordmark fijo en z-0).
 * La sección NO crea stacking context, así el z negativo queda en el contexto raíz.
 */
export function Hero({ introDone }: { introDone: boolean }) {
  return (
    <header id="inicio" className="relative h-svh">
      <div className="absolute inset-0 z-[-1]">
        <SmartVideo name="hero" hero label="Miles GT40 verde #77 saliendo del taller" className="h-full w-full" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/.55)_0%,rgb(0_0_0/.35)_40%,rgb(0_0_0/.45)_60%,rgb(0_0_0/.85)_100%)]" />
        {/* Cortina negra de la intro: tapa el poster hasta que aparece el wordmark. */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-[1200ms] ease-out ${introDone ? 'opacity-0' : 'opacity-100'}`}
        />
      </div>

      <h1 className="sr-only">Alisi Motors · Miles GT40 · Art &amp; Speed</h1>

      <div
        className={`absolute inset-x-0 bottom-0 z-10 flex flex-col items-center gap-6 px-6 transition-opacity delay-300 duration-1000 ${
          introDone ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.75rem)' }}
      >
        <CTA href={waLink(0)} className="w-full max-w-xs">
          Consultá por tu unidad
        </CTA>
        <a href="#solo-24" className="flex min-h-11 min-w-11 flex-col items-center justify-center text-white/60" aria-label="Bajar">
          <span className="block h-9 w-px origin-top animate-[scrollcue_2.2s_ease-in-out_infinite] bg-white/70" />
        </a>
      </div>
    </header>
  );
}
