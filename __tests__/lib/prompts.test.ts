// ============================================
// __tests__/lib/prompts.test.ts
// 测试 lib/prompts.ts — Prompt 模板逻辑（男女分开）
// ============================================

import { describe, it, expect } from 'vitest';
import {
  TIER_IMAGE_COUNTS,
  fillPromptTemplate,
  getTierPrompts,
  TIER_PROMPT_TEMPLATES,
} from '@/lib/prompts';
import type { Tier } from '@/lib/tiers';

const GENDERS = ['man', 'woman'] as const;

// ============================================
// 1. TIER_IMAGE_COUNTS
// ============================================
describe('TIER_IMAGE_COUNTS', () => {
  it('should have correct image counts for each tier', () => {
    expect(TIER_IMAGE_COUNTS.starter).toBe(45);
    expect(TIER_IMAGE_COUNTS.professional).toBe(66);
    expect(TIER_IMAGE_COUNTS.executive).toBe(108);
  });

  it('should be in ascending order', () => {
    expect(TIER_IMAGE_COUNTS.starter).toBeLessThan(TIER_IMAGE_COUNTS.professional);
    expect(TIER_IMAGE_COUNTS.professional).toBeLessThan(TIER_IMAGE_COUNTS.executive);
  });
});

// ============================================
// 2. fillPromptTemplate
// ============================================
describe('fillPromptTemplate', () => {
  it('should replace {type} with the provided type', () => {
    const template = 'portrait of ohwx {type} wearing a suit';
    expect(fillPromptTemplate(template, 'man')).toBe('portrait of ohwx man wearing a suit');
    expect(fillPromptTemplate(template, 'woman')).toBe('portrait of ohwx woman wearing a suit');
    expect(fillPromptTemplate(template, 'person')).toBe('portrait of ohwx person wearing a suit');
  });

  it('should replace multiple {type} occurrences', () => {
    const template = 'ohwx {type} and ohwx {type}';
    expect(fillPromptTemplate(template, 'man')).toBe('ohwx man and ohwx man');
  });

  it('should not modify template without {type}', () => {
    const template = 'portrait of a person wearing a suit';
    expect(fillPromptTemplate(template, 'man')).toBe('portrait of a person wearing a suit');
  });
});

// ============================================
// 3. TIER_PROMPT_TEMPLATES 结构验证
// ============================================
describe('TIER_PROMPT_TEMPLATES structure', () => {
  it('should have templates for all 3 tiers', () => {
    expect(Object.keys(TIER_PROMPT_TEMPLATES)).toHaveLength(3);
    expect(TIER_PROMPT_TEMPLATES.starter).toBeDefined();
    expect(TIER_PROMPT_TEMPLATES.professional).toBeDefined();
    expect(TIER_PROMPT_TEMPLATES.executive).toBeDefined();
  });

  it('each tier should have both man and woman prompts', () => {
    for (const tier of Object.keys(TIER_PROMPT_TEMPLATES) as Tier[]) {
      expect(TIER_PROMPT_TEMPLATES[tier].man).toBeDefined();
      expect(TIER_PROMPT_TEMPLATES[tier].woman).toBeDefined();
      expect(TIER_PROMPT_TEMPLATES[tier].man.length).toBeGreaterThanOrEqual(5);
      expect(TIER_PROMPT_TEMPLATES[tier].woman.length).toBeGreaterThanOrEqual(5);
    }
  });

  it('total images per tier per gender should match TIER_IMAGE_COUNTS', () => {
    for (const tier of Object.keys(TIER_PROMPT_TEMPLATES) as Tier[]) {
      for (const gender of GENDERS) {
        const totalImages = TIER_PROMPT_TEMPLATES[tier][gender].reduce(
          (sum: number, t) => sum + t.num_images,
          0
        );
        expect(totalImages).toBe(TIER_IMAGE_COUNTS[tier]);
      }
    }
  });

  it('each prompt should have non-empty text', () => {
    for (const tier of Object.keys(TIER_PROMPT_TEMPLATES) as Tier[]) {
      for (const gender of GENDERS) {
        for (const template of TIER_PROMPT_TEMPLATES[tier][gender]) {
          expect(template.text).toBeTruthy();
          expect(template.text.length).toBeGreaterThan(20);
        }
      }
    }
  });

  it('each prompt should have num_images === 1', () => {
    for (const tier of Object.keys(TIER_PROMPT_TEMPLATES) as Tier[]) {
      for (const gender of GENDERS) {
        for (const template of TIER_PROMPT_TEMPLATES[tier][gender]) {
          expect(template.num_images).toBe(1);
        }
      }
    }
  });

  it('each prompt should contain {type} placeholder', () => {
    for (const tier of Object.keys(TIER_PROMPT_TEMPLATES) as Tier[]) {
      for (const gender of GENDERS) {
        for (const template of TIER_PROMPT_TEMPLATES[tier][gender]) {
          expect(template.text).toContain('{type}');
        }
      }
    }
  });

  it('each prompt should contain ohwx token', () => {
    for (const tier of Object.keys(TIER_PROMPT_TEMPLATES) as Tier[]) {
      for (const gender of GENDERS) {
        for (const template of TIER_PROMPT_TEMPLATES[tier][gender]) {
          expect(template.text).toContain('ohwx');
        }
      }
    }
  });

  it('higher tiers should have more prompts than lower tiers (per gender)', () => {
    expect(TIER_PROMPT_TEMPLATES.starter.man.length).toBeLessThan(
      TIER_PROMPT_TEMPLATES.professional.man.length
    );
    expect(TIER_PROMPT_TEMPLATES.professional.man.length).toBeLessThan(
      TIER_PROMPT_TEMPLATES.executive.man.length
    );
    expect(TIER_PROMPT_TEMPLATES.starter.woman.length).toBeLessThan(
      TIER_PROMPT_TEMPLATES.professional.woman.length
    );
    expect(TIER_PROMPT_TEMPLATES.professional.woman.length).toBeLessThan(
      TIER_PROMPT_TEMPLATES.executive.woman.length
    );
  });

  it('prompt count matches image count (num_images=1)', () => {
    for (const tier of Object.keys(TIER_PROMPT_TEMPLATES) as Tier[]) {
      for (const gender of GENDERS) {
        expect(TIER_PROMPT_TEMPLATES[tier][gender].length).toBe(TIER_IMAGE_COUNTS[tier]);
      }
    }
  });
});

// ============================================
// 4. getTierPrompts
// ============================================
describe('getTierPrompts', () => {
  it('should return prompts with {type} replaced', () => {
    for (const type of ['man', 'woman'] as const) {
      const prompts = getTierPrompts('starter', type);
      for (const p of prompts) {
        expect(p.text).not.toContain('{type}');
        expect(p.text).toContain(type);
      }
    }
  });

  it('should return correct number of prompts for each tier', () => {
    for (const type of ['man', 'woman'] as const) {
      expect(getTierPrompts('starter', type).length).toBe(TIER_IMAGE_COUNTS.starter);
      expect(getTierPrompts('professional', type).length).toBe(TIER_IMAGE_COUNTS.professional);
      expect(getTierPrompts('executive', type).length).toBe(TIER_IMAGE_COUNTS.executive);
    }
  });

  it('should preserve num_images from templates (should be 1)', () => {
    const prompts = getTierPrompts('starter', 'man');
    const totalImages = prompts.reduce((sum, p) => sum + p.num_images, 0);
    expect(totalImages).toBe(45);
  });

  it('should handle man and woman type values', () => {
    for (const type of ['man', 'woman'] as const) {
      const prompts = getTierPrompts('starter', type);
      expect(prompts.length).toBeGreaterThan(0);
      expect(prompts[0].text).toContain(type);
    }
  });

  it('should fallback unknown types to man prompts', () => {
    const prompts = getTierPrompts('starter', 'person');
    expect(prompts.length).toBe(TIER_IMAGE_COUNTS.starter);
    expect(prompts[0].text).toContain('man');
    expect(prompts[0].text).not.toContain('woman');
  });

  it('should follow Astria concise prompt structure (ohwx first, 3 slots per outfit)', () => {
    const proWoman = getTierPrompts('professional', 'woman');
    expect(proWoman[0].text.startsWith('ohwx woman')).toBe(true);
    expect(proWoman[0].text).toContain('tight close-up headshot');
    expect(proWoman[0].text).toContain('cropped at collarbone');
    expect(proWoman[0].text).toContain('front-facing');
    expect(proWoman[0].text).toContain('natural skin texture');
    expect(proWoman[0].text).toContain('head level');
    expect(proWoman[0].text).not.toContain('luminous face');
    expect(proWoman[0].text).toContain('pure white seamless studio backdrop');
    expect(proWoman[1].text).toContain('three-quarter view turned right');
    expect(proWoman[1].text).toContain('face toward camera not profile');
    expect(proWoman[1].text).toContain('warm closed-lip smile');
    expect(proWoman[1].text).toContain('light grey seamless studio backdrop');
    expect(proWoman[2].text).toContain('arms crossed at chest');
    expect(proWoman[2].text).toContain('front-facing');
    expect(proWoman[2].text).toContain('soft even studio lighting');
    expect(proWoman[2].text).not.toContain('key light from left');
    expect(proWoman[0].text).not.toContain('75% of frame height');
    expect(proWoman[0].text).not.toContain('aspect ratio');

    const basicMan = getTierPrompts('starter', 'man');
    const outfit1Slots = basicMan.slice(0, 3);
    expect(outfit1Slots).toHaveLength(3);
    expect(outfit1Slots[0].text).toContain('front-facing');
    expect(outfit1Slots[1].text).toContain('three-quarter view turned right');
    expect(outfit1Slots[2].text).toContain('arms crossed at chest');
    expect(outfit1Slots[0].text).not.toContain('warm closed-lip smile');
    expect(outfit1Slots[0].text.split(/[\s,]+/).filter(Boolean).length).toBeLessThan(55);
  });
});
