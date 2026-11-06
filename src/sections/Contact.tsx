import type { ReactNode } from 'react';
import { Reveal } from '../components/Reveal';
import { useToast } from '../components/Toast';
import { CopyIcon, InstagramIcon, MailIcon, WhatsAppIcon } from '../components/icons';
import { contact, mailLink, waLink } from '../lib/contact';
import { copyText } from '../lib/clipboard';

function Row({ href, icon, label, value, copy, primary }: { href: string; icon: ReactNode; label: string; value: string; copy: string; primary?: boolean }) {
  const toast = useToast();
  const external = href.startsWith('http');
  return (
    <div className="flex gap-2">
      <a
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener' } : {})}
        className={`flex min-h-[64px] flex-1 items-center gap-4 rounded-2xl px-5 transition-colors ${
          primary ? 'bg-cta text-white active:bg-[#b81414]' : 'bg-white/[0.07] text-white active:bg-white/15'
        }`}
      >
        <span className="shrink-0">{icon}</span>
        <span className="min-w-0">
          <span className={`block text-[0.7rem] tracking-[0.2em] uppercase ${primary ? 'text-white/80' : 'text-white/50'}`}>{label}</span>
          <span className="block truncate text-[1.05rem] font-semibold">{value}</span>
        </span>
      </a>
      <button
        type="button"
        onClick={async () => toast((await copyText(copy)) ? 'Copied ✓' : 'Could not copy')}
        className="flex min-h-[64px] w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-white/[0.07] text-[0.65rem] tracking-wide text-white/70 active:bg-white/15"
        aria-label={`Copy ${value}`}
      >
        <CopyIcon />
        Copy
      </button>
    </div>
  );
}

export function Contact() {
  const [wa1, wa2] = contact.whatsapp;
  return (
    <section id="contact" className="section px-5 pt-24 pb-20">
      <div className="text-center">
        <h2 className="sr-only">Contact</h2>
        <Reveal as="p" className="mx-auto max-w-sm text-lg text-white/80">
          Write to us and we'll tell you all about the Miles GT40: availability, customization and delivery.
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mx-auto mt-12 flex max-w-md flex-col gap-3">
        <Row href={waLink(0)} primary icon={<WhatsAppIcon className="h-6 w-6" />} label={wa1.label} value={wa1.display} copy={wa1.display} />
        <Row href={waLink(1)} icon={<WhatsAppIcon className="h-6 w-6" />} label={wa2.label} value={wa2.display} copy={wa2.display} />
        <Row href={mailLink()} icon={<MailIcon className="h-6 w-6" />} label="Email" value={contact.email} copy={contact.email} />
        <a
          href={contact.instagram.url}
          target="_blank"
          rel="noopener"
          className="flex min-h-[64px] items-center justify-center gap-3 rounded-2xl border border-white/20 text-[1.05rem] font-semibold active:bg-white/10"
        >
          <InstagramIcon className="h-6 w-6" />
          {contact.instagram.handle}
        </a>
      </Reveal>
    </section>
  );
}
