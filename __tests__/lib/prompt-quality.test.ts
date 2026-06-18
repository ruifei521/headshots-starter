import { describe, it, expect } from 'vitest';
import {
  PORTRAIT_GENERATION_OPTIONS,
  PORTRAIT_NEGATIVE_PROMPT,
} from '@/lib/prompt-quality';

describe('PORTRAIT_GENERATION_OPTIONS (Astria sign-off Jun 2026)', () => {
  it('should preserve likeness over face repainting', () => {
    expect(PORTRAIT_GENERATION_OPTIONS.inpaint_faces).toBe(false);
    expect(PORTRAIT_GENERATION_OPTIONS.face_correct).toBe(false);
    expect(PORTRAIT_GENERATION_OPTIONS.face_swap).toBe(false);
  });

  it('should keep super resolution and photographic style', () => {
    expect(PORTRAIT_GENERATION_OPTIONS.super_resolution).toBe(true);
    expect(PORTRAIT_GENERATION_OPTIONS.style).toBe('Photographic');
  });

  it('should include minimal negative for glasses and oversmooth', () => {
    expect(PORTRAIT_NEGATIVE_PROMPT).toContain('glare on glasses');
    expect(PORTRAIT_NEGATIVE_PROMPT).toContain('oversmoothed skin');
  });
});
