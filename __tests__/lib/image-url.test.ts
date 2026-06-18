import { describe, it, expect } from 'vitest';
import { galleryImageUrl, fullSizeImageUrl, trainingSampleImageUrl, headshotGalleryImageUrl } from '@/lib/image-url';

describe('image-url', () => {
  it('transforms Supabase public URLs to render endpoint', () => {
    const uri =
      'https://abc.supabase.co/storage/v1/object/public/headshots/model-1/1.jpg';
    expect(galleryImageUrl(uri)).toBe(
      'https://abc.supabase.co/storage/v1/render/image/public/headshots/model-1/1.jpg?width=480&quality=80&resize=cover'
    );
  });

  it('passes through non-Supabase URLs', () => {
    const uri = 'https://example.com/photo.jpg';
    expect(galleryImageUrl(uri)).toBe(uri);
    expect(trainingSampleImageUrl(uri)).toBe(uri);
    expect(fullSizeImageUrl(uri)).toBe(uri);
  });

  it('uses contain resize for training sample thumbnails', () => {
    const uri =
      'https://abc.supabase.co/storage/v1/object/public/headshots/model-1/1.jpg';
    expect(trainingSampleImageUrl(uri, 280)).toBe(
      'https://abc.supabase.co/storage/v1/render/image/public/headshots/model-1/1.jpg?width=280&quality=80&resize=contain'
    );
  });

  it('scales headshot results without center crop', () => {
    const uri =
      'https://abc.supabase.co/storage/v1/object/public/headshots/model-1/out.jpg';
    expect(headshotGalleryImageUrl(uri, 416)).toBe(
      'https://abc.supabase.co/storage/v1/render/image/public/headshots/model-1/out.jpg?width=416&quality=80'
    );
  });
});
