import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './icons';
import { waLink } from '../lib/contact';

/** Botón flotante: aparece después del hero y se oculta mientras Contacto está en pantalla. */
export function WhatsAppFab() {
  const [pastHero, setPastHero] = useState(false);
  const [inContact, setInContact] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('inicio');
    const contact = document.getElementById('contacto');
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) setPastHero(!e.isIntersecting);
        if (e.target === contact) setInContact(e.isIntersecting);
      }
    });
    if (hero) io.observe(hero);
    if (contact) io.observe(contact);
    return () => io.disconnect();
  }, []);

  const visible = pastHero && !inContact;

  return (
    <a
      href={waLink(0)}
      target="_blank"
      rel="noopener"
      aria-label="Consultar por WhatsApp"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={`fixed z-50 flex h-14 w-14 items-center justify-center rounded-full bg-red text-white shadow-[0_8px_30px_rgb(0_0_0/.5)] transition-[opacity,transform] duration-300 active:scale-95 ${
        visible ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
      style={{ right: 'calc(env(safe-area-inset-right) + 1rem)', bottom: 'calc(env(safe-area-inset-bottom) + 1rem)' }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  );
}
