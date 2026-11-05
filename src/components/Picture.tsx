import type { CSSProperties } from 'react';
import { imgUrl } from '../lib/media';

export type Photo = {
  id: string;
  width: number;
  height: number;
  widths: number[];
  placeholder: string;
  alt: string;
};

type Props = {
  photo: Photo;
  sizes?: string;
  /** Primera imagen visible: carga eager + fetchpriority high. */
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
  alt?: string;
};

export function Picture({ photo, sizes = '100vw', priority, className = '', style, alt }: Props) {
  const set = (fmt: 'avif' | 'webp') => photo.widths.map((w) => `${imgUrl(photo.id, w, fmt)} ${w}w`).join(', ');
  const fallbackW = photo.widths.includes(960) ? 960 : photo.widths[photo.widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <img
        src={imgUrl(photo.id, fallbackW, 'webp')}
        srcSet={set('webp')}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={alt ?? photo.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={className}
        style={{ backgroundImage: `url(${photo.placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center', ...style }}
        draggable={false}
      />
    </picture>
  );
}
