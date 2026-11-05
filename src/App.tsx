import { useCallback, useEffect, useState } from 'react';
import { LazyMotion, domAnimation } from 'motion/react';
import { Wordmark } from './components/Wordmark';
import { ToastProvider } from './components/Toast';
import { Hero } from './sections/Hero';
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
          <div className="section h-[150svh]" />
        </main>
      </ToastProvider>
    </LazyMotion>
  );
}
