import { describe, expect, it } from 'vitest';
import {
  buildAstriaTunePayload,
  filterAstriaCharacteristics,
  ASTRIA_FLUX_BASE_TUNE_ID,
} from '@/lib/astria-tune';

describe('astria-tune', () => {
  it('builds flux lora payload without prompts_attributes', () => {
    const body = buildAstriaTunePayload({
      title: 'Jane — snapprohead-1',
      name: 'woman',
      imageUrls: ['https://example.com/a.jpg'],
      trainCallbackUrl: 'https://snapprohead.com/astria/train-webhook?x=1',
      testMode: false,
    });

    expect(body.tune).toMatchObject({
      base_tune_id: ASTRIA_FLUX_BASE_TUNE_ID,
      model_type: 'lora',
      preset: 'flux-lora-portrait',
      token: 'ohwx',
    });
    expect(body.tune).not.toHaveProperty('prompts_attributes');
    expect(body.tune).not.toHaveProperty('branch');
  });

  it('builds fast test payload', () => {
    const body = buildAstriaTunePayload({
      title: 'Test',
      name: 'man',
      imageUrls: ['https://example.com/a.jpg'],
      trainCallbackUrl: 'https://snapprohead.com/cb',
      testMode: true,
    });

    expect(body.tune).toMatchObject({ branch: 'fast' });
    expect(body.tune).not.toHaveProperty('base_tune_id');
  });

  it('filters characteristics to allowed keys only', () => {
    const filtered = filterAstriaCharacteristics({
      eye_color: 'brown eyes',
      name: 'woman',
      blurry: true,
    });

    expect(filtered).toEqual({ eye_color: 'brown eyes' });
  });
});
