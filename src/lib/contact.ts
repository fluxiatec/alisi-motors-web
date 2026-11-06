import contact from '../data/contact.json';

export type Unit = (typeof import('../data/units.json'))['units'][number];

/** Link de WhatsApp con el mensaje precargado. `index` 0 = WhatsApp 1. */
export const waLink = (index = 0) =>
  `https://wa.me/${contact.whatsapp[index].number}?text=${encodeURIComponent(contact.message)}`;

export const mailLink = () => `mailto:${contact.email}?subject=${encodeURIComponent(contact.emailSubject)}`;

export { contact };
