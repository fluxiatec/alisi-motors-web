import Lenis from 'lenis';
import { prefersReducedMotion } from '../hooks/usePrefs';

/** Scroll suave solo con rueda/trackpad; en touch queda el scroll nativo (syncTouch: false). */
export function initLenis() {
  if (prefersReducedMotion()) return () => {};
  const lenis = new Lenis({ syncTouch: false, anchors: { offset: 0 }, lerp: 0.11, autoRaf: true });
  return () => lenis.destroy();
}
