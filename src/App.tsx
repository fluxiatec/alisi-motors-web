import { useCallback, useEffect, useState } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import { useWordmark } from './components/Wordmark';
import { ToastProvider } from './components/Toast';
import { WhatsAppFab } from './components/WhatsAppFab';
import { Hero } from './sections/Hero';
import { Manifesto } from './sections/Manifesto';
import { Units } from './sections/Units';
import { Engineering } from './sections/Engineering';
import { MateVideo } from './sections/MateVideo';
import { Partners } from './sections/Partners';
import { Contact } from './sections/Contact';
import { Footer } from './sections/Footer';
import { initLenis } from './lib/lenis';

/**
 * Capas: logo fijo (z-0, en index.html) · video del hero (z-[-1]) · secciones negras (.section, z-10).
 * Los <div className="window"> son huecos transparentes donde se vuelve a ver el logo.
 * Ojo: ningún ancestro de las secciones debe crear stacking context (transform, opacity, z-index).
 */
export function App() {
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  useWordmark(onIntroDone);
  useEffect(() => initLenis(), []);

  return (
    <LazyMotion features={domAnimation} strict>
      <ToastProvider>
        <main>
          <Hero introDone={introDone} />
          <div className="window" />
          <Manifesto />
          <div className="window" />
          <Units />
          <div className="window" />
          <Engineering />
          <MateVideo />
          <div className="window" />
          <Partners />
          <Contact />
          <Footer />
        </main>
        <WhatsAppFab />
      </ToastProvider>
    </LazyMotion>
  );
}
