import { describe, it, expect } from 'vitest';
import { getUploadErrorHints } from '@/lib/upload-errors';

describe('getUploadErrorHints', () => {
  it('suggests re-login for unauthorized errors', () => {
    const hints = getUploadErrorHints('Unauthorized', 401);
    expect(hints.some((h) => h.includes('sign in'))).toBe(true);
  });

  it('suggests supported formats for file type errors', () => {
    const hints = getUploadErrorHints('File type "image/gif" is not allowed');
    expect(hints.some((h) => h.includes('PNG'))).toBe(true);
  });

  it('suggests format fix for 413 payload too large', () => {
    const hints = getUploadErrorHints('Payload Too Large', 413);
    expect(hints.some((h) => h.includes('optimization'))).toBe(true);
  });

  it('always includes support email', () => {
    const hints = getUploadErrorHints('Something went wrong');
    expect(hints.some((h) => h.includes('contact@snapprohead.com'))).toBe(true);
  });
});
