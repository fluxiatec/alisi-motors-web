import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import useEmblaCarousel from 'embla-carousel-react';
import { Picture } from './Picture';
import { CTA } from './CTA';
import { ArrowIcon, CloseIcon } from './icons';
import { waLink, type Unit } from '../lib/contact';

type Props = { unit: Unit; onClose: () => void };

/**
 * Lightbox a pantalla completa con Embla. Swipe lateral entre fotos;
 * swipe hacia abajo, la X, Esc o el botón "atrás" del celular lo cierran.
 */
export default function Lightbox({ unit, onClose }: Props) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: unit.photos.length > 2 });
  const [index, setIndex] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const start = useRef<{ x: number; y: number; vertical: boolean | null } | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Abrimos con pushState: cerrar = volver en el historial (la X y "atrás" hacen lo mismo).
  const requestClose = useCallback(() => {
    if (history.state?.lightbox) history.back();
    else onCloseRef.current();
  }, []);

  // Historial, bloqueo de scroll y foco (una sola vez).
  useEffect(() => {
    history.pushState({ lightbox: true }, '');
    const onPop = () => onCloseRef.current();
    window.addEventListener('popstate', onPop);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    html.classList.add('lenis-stopped');
    closeBtn.current?.focus();
    return () => {
      window.removeEventListener('popstate', onPop);
      html.style.overflow = prev;
      html.classList.remove('lenis-stopped');
    };
  }, []);

  // Teclado + índice actual.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      if (e.key === 'ArrowRight') embla?.scrollNext();
      if (e.key === 'ArrowLeft') embla?.scrollPrev();
    };
    window.addEventListener('keydown', onKey);
    const onSelect = () => embla && setIndex(embla.selectedScrollSnap());
    embla?.on('select', onSelect);
    return () => {
      window.removeEventListener('keydown', onKey);
      embla?.off('select', onSelect);
    };
  }, [embla, requestClose]);

  // Swipe hacia abajo para cerrar (solo si el gesto es claramente vertical).
  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === 'mouse') return;
    start.current = { x: e.clientX, y: e.clientY, vertical: null };
  };
  const onPointerMove = (e: PointerEvent) => {
    const s = start.current;
    if (!s) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (s.vertical === null && Math.hypot(dx, dy) > 10) {
      s.vertical = dy > 0 && Math.abs(dy) > Math.abs(dx) * 1.2;
      if (s.vertical) setDragging(true);
    }
    if (s.vertical) setDragY(Math.max(0, dy));
  };
  const onPointerUp = () => {
    if (start.current?.vertical && dragY > 110) {
      setClosing(true);
      window.setTimeout(requestClose, 180);
    } else setDragY(0);
    setDragging(false);
    start.current = null;
  };

  const progress = Math.min(dragY / 400, 1);
  const chrome = { opacity: closing ? 0 : 1 - progress * 2, transition: 'opacity .2s' };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Fotos del Miles GT40 ${unit.color}`}
      className="fixed inset-0 z-[60] flex flex-col"
      style={{ backgroundColor: `rgb(0 0 0 / ${closing ? 0 : 1 - progress * 0.7})`, transition: 'background-color .2s' }}
    >
      <div className="flex items-center justify-between gap-3 pr-2 pl-5" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 0.5rem)', ...chrome }}>
        <p className="flex items-baseline gap-3 text-sm text-white/70">
          <span className="font-display text-lg tracking-wide text-white uppercase">
            {unit.color}
            {unit.raceNumber && <span className="text-red"> #{unit.raceNumber}</span>}
          </span>
          <span className="tabular-nums">
            {index + 1} / {unit.photos.length}
          </span>
        </p>
        <button
          ref={closeBtn}
          type="button"
          onClick={requestClose}
          className="flex h-12 w-12 items-center justify-center rounded-full text-white active:bg-white/10"
          aria-label="Cerrar"
        >
          <CloseIcon />
        </button>
      </div>

      <div
        className="relative min-h-0 flex-1"
        style={{
          transform: `translate3d(0, ${closing ? 600 : dragY}px, 0) scale(${1 - progress * 0.15})`,
          transition: dragging ? 'none' : 'transform .25s cubic-bezier(.2,.7,.2,1)',
          touchAction: 'pinch-zoom',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full">
            {unit.photos.map((p, i) => (
              <div key={p.id} className="flex h-full min-w-0 flex-[0_0_100%] items-center justify-center px-1">
                <Picture photo={p} sizes="100vw" priority={i === 0} className="max-h-full w-full object-contain" />
              </div>
            ))}
          </div>
        </div>
        {unit.photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => embla?.scrollPrev()}
              className="absolute top-1/2 left-3 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white md:flex"
              aria-label="Foto anterior"
            >
              <ArrowIcon dir="left" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => embla?.scrollNext()}
              className="absolute top-1/2 right-3 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-white md:flex"
              aria-label="Foto siguiente"
            >
              <ArrowIcon className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col items-center gap-4 px-5" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.25rem)', ...chrome }}>
        <div className="flex" aria-hidden="true">
          {unit.photos.map((p, i) => (
            <span key={p.id} className="flex h-6 items-center px-1">
              <span className={`block h-[3px] rounded-full transition-all ${i === index ? 'w-6 bg-red' : 'w-3 bg-white/35'}`} />
            </span>
          ))}
        </div>
        <CTA href={waLink(0, unit)} className="w-full max-w-sm">
          Consultar por esta unidad
        </CTA>
        <p className="text-[0.7rem] text-white/40">{unit.credit ? `Foto: ${unit.credit}` : 'Deslizá hacia abajo para cerrar'}</p>
      </div>
    </div>,
    document.body,
  );
}
