/**
 * Gallery thumbnails — avoid loading full-resolution Astria/Supabase JPEGs in the grid.
 * Uses Supabase Image Transform when URL matches our storage bucket; otherwise Next/Image resizes.
 */
const GALLERY_WIDTH = 480;
const GALLERY_QUALITY = 80;

const SUPABASE_PUBLIC_OBJECT = /^(https:\/\/[^/]+)\/storage\/v1\/object\/public\/(.+)$/;

/** Public storage URL → transformed render URL (width capped, WebP when supported). */
export function galleryImageUrl(uri: string, width = GALLERY_WIDTH): string {
  const match = uri.match(SUPABASE_PUBLIC_OBJECT);
  if (!match) return uri;
  const [, origin, path] = match;
  const params = new URLSearchParams({
    width: String(width),
    quality: String(GALLERY_QUALITY),
    resize: 'cover',
  });
  return `${origin}/storage/v1/render/image/public/${path}?${params.toString()}`;
}

/**
 * Headshot result thumbnails — scale to width only (no center crop).
 * CSS object-cover + object-top keeps the face in frame inside 4:5 tiles.
 */
export function headshotGalleryImageUrl(uri: string, width = 416): string {
  const match = uri.match(SUPABASE_PUBLIC_OBJECT);
  if (!match) return uri;
  const [, origin, path] = match;
  const params = new URLSearchParams({
    width: String(width),
    quality: String(GALLERY_QUALITY),
  });
  return `${origin}/storage/v1/render/image/public/${path}?${params.toString()}`;
}

/** Training upload previews — show full face, no center crop. */
export function trainingSampleImageUrl(uri: string, width = 280): string {
  const match = uri.match(SUPABASE_PUBLIC_OBJECT);
  if (!match) return uri;
  const [, origin, path] = match;
  const params = new URLSearchParams({
    width: String(width),
    quality: String(GALLERY_QUALITY),
    resize: 'contain',
  });
  return `${origin}/storage/v1/render/image/public/${path}?${params.toString()}`;
}

/** Original URL for download / zip — always full resolution. */
export function fullSizeImageUrl(uri: string): string {
  return uri;
}
