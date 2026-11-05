const BASE = import.meta.env.BASE_URL;
export const imgUrl = (id: string, w: number, fmt: 'avif' | 'webp') => `${BASE}media/img/${id}-${w}.${fmt}`;
export const videoUrl = (name: string, h: 720 | 1080) => `${BASE}media/video/${name}-${h}.mp4`;
export const posterUrl = (name: string) => `${BASE}media/video/${name}-poster.webp`;
