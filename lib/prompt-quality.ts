/**
 * Astria portrait generation options (Flux LoRA).
 *
 * Likeness > beauty polish: inpaint_faces and face_correct re-draw the face and
 * often oversmooth skin, add glasses glare, and drift from the trained identity.
 * super_resolution stays on for output sharpness without altering facial identity.
 *
 * face_swap OFF: training selfies are often neutral; face_swap overrides expression.
 */

export const PORTRAIT_NEGATIVE_PROMPT =
  'blurry face, distorted features, extra fingers, deformed hands, text, watermark, logo, busy background, harsh shadows, oversmoothed skin, plastic skin, flyaway hair, glare on glasses';

export const PORTRAIT_GENERATION_OPTIONS = {
  super_resolution: true,
  inpaint_faces: false,
  face_correct: false,
  face_swap: false,
  style: 'Photographic' as const,
  negative_prompt: PORTRAIT_NEGATIVE_PROMPT,
} as const;
