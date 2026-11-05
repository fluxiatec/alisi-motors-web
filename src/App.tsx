import { useCallback, useEffect, useState } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import { Wordmark } from './components/Wordmark';
import { ToastProvider } from './components/Toast';
import { Hero } from './sections/Hero';
import { Only24 } from './sections/Only24';
import { Manifesto } from './sections/Manifesto';
import { Units } from './sections/Units';
import { initLenis } from './lib/lenis';

export function App() {
  const [introDone, setIntroDone] = useState(false);
  const onIntroDone = useCallback(() => setIntroDone(true), []);

  useEffect(() => initLenis(), []);

  return (
    <LazyMotion features={domAnimation} strict>
      <ToastProvider>
        <Wordmark onIntroDone={onIntroDone} />
        <main>
          <Hero introDone={introDone} />
          <div className="window" />
          <Only24 />
          <Manifesto />
          <div className="window" />
          <Units />
          <div className="window" />
          <div className="section h-[150svh]" />
        </main>
      </ToastProvider>
    </LazyMotion>
  );
}
