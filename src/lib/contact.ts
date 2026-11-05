import contact from '../data/contact.json';

export type Unit = (typeof import('../data/units.json'))['units'][number];

export const unitLabel = (u: Pick<Unit, 'color' | 'colorShort' | 'raceNumber'>) =>
  `${u.colorShort.toLowerCase()}${u.raceNumber ? ` #${u.raceNumber}` : ''}`;

/** Link de WhatsApp con mensaje precargado. `index` 0 = WhatsApp 1. */
export function waLink(index = 0, unit?: Unit) {
  const msg = unit ? contact.unitMessage.replace('{unit}', unitLabel(unit)) : contact.message;
  return `https://wa.me/${contact.whatsapp[index].number}?text=${encodeURIComponent(msg)}`;
}

export const mailLink = () =>
  `mailto:${contact.email}?subject=${encodeURIComponent(contact.emailSubject)}`;

export { contact };
