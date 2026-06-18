/**
 * Shared prompt building for generate-woman-prompts.js and generate-man-prompts.js
 *
 * Astria / Flux (final sign-off, Jun 2026):
 * - ohwx {type} first; short prompts; pose early
 * - Slot 0–1: tight close-up, cropped at collarbone
 * - Slot 2: front-facing arms crossed; even light (no directional key light)
 * - Slot 1: three-quarter view (pose before tier prefix; no head level — fights 3/4)
 * - Natural look: no "luminous face" / "vivid catchlights" (oversmooths + glasses glare)
 * - No weighted prompts; style via API (Photographic)
 *
 * Per outfit: 3 slots (front | 3/4 | arms crossed)
 */

/** @typedef {{ framing: string, pose: string, expression: string, lighting: string, bg: string }} SlotTemplate */

const NATURAL_LIGHT =
  'soft even studio lighting, natural skin texture';

/** @type {SlotTemplate[]} */
const WOMAN_SLOTS = [
  {
    framing: 'tight close-up headshot, cropped at collarbone',
    pose: 'front-facing, face toward camera, head level, shoulders square',
    expression: '',
    lighting: NATURAL_LIGHT,
    bg: 'pure white seamless studio backdrop',
  },
  {
    framing: 'tight close-up headshot, cropped at collarbone',
    pose: 'three-quarter view turned right, face toward camera not profile',
    expression: 'warm closed-lip smile',
    lighting: 'soft natural daylight studio lighting, natural skin texture',
    bg: 'light grey seamless studio backdrop',
  },
  {
    framing: '',
    pose: 'front-facing, arms crossed at chest, head level, shoulders square',
    expression: '',
    lighting: NATURAL_LIGHT,
    bg: 'pure white seamless studio backdrop',
  },
];

/** @type {SlotTemplate[]} */
const MAN_SLOTS = [
  {
    framing: 'tight close-up headshot, cropped at collarbone',
    pose: 'front-facing, face toward camera, head level, shoulders square',
    expression: '',
    lighting: NATURAL_LIGHT,
    bg: 'pure white seamless studio backdrop',
  },
  {
    framing: 'tight close-up headshot, cropped at collarbone',
    pose: 'three-quarter view turned right, face toward camera not profile',
    expression: '',
    lighting: 'soft natural daylight studio lighting, natural skin texture',
    bg: 'light grey seamless studio backdrop',
  },
  {
    framing: '',
    pose: 'front-facing, arms crossed at chest, head level, shoulders square',
    expression: '',
    lighting: NATURAL_LIGHT,
    bg: 'pure white seamless studio backdrop',
  },
];

const SLOTS_BY_GENDER = {
  woman: WOMAN_SLOTS,
  man: MAN_SLOTS,
};

function prefixFor(tier, outfitId, casualIds) {
  const casual = casualIds.has(outfitId);
  if (tier === 'starter') {
    return casual ? 'business casual headshot' : 'professional corporate headshot';
  }
  if (tier === 'professional') {
    return casual ? 'business casual headshot' : 'high-end corporate headshot';
  }
  return casual ? 'executive business casual headshot' : 'luxury executive headshot';
}

function composePrompt(prefix, slotTemplate, wearing) {
  const parts = ['ohwx {type}'];
  if (slotTemplate.framing) parts.push(slotTemplate.framing);
  parts.push(slotTemplate.pose);
  parts.push(prefix);
  if (slotTemplate.expression) parts.push(slotTemplate.expression);
  parts.push(`wearing ${wearing}`);
  parts.push(slotTemplate.lighting);
  parts.push(slotTemplate.bg);
  return `      { text: \`${parts.join(', ')}\`, num_images: 1 }`;
}

function buildPrompt(tier, outfitId, slot, wearing, casualIds, gender) {
  const prefix = prefixFor(tier, outfitId, casualIds);
  const slotTemplate = SLOTS_BY_GENDER[gender][slot];
  return composePrompt(prefix, slotTemplate, wearing);
}

function buildTier(outfits, outfitIds, casualIds, tier, gender) {
  const lines = [];
  outfitIds.forEach((id) => {
    for (let slot = 0; slot < 3; slot++) {
      lines.push(buildPrompt(tier, id, slot, outfits[id], casualIds, gender));
    }
  });
  return lines;
}

function buildStarter(outfits, basicOutfits, casualIds, gender) {
  return buildTier(outfits, basicOutfits, casualIds, 'starter', gender);
}

function buildProfessional(outfits, proOutfits, casualIds, gender) {
  return buildTier(outfits, proOutfits, casualIds, 'professional', gender);
}

function buildExecutive(outfits, execOutfits, casualIds, gender) {
  return buildTier(outfits, execOutfits, casualIds, 'executive', gender);
}

module.exports = {
  buildStarter,
  buildProfessional,
  buildExecutive,
  WOMAN_SLOTS,
  MAN_SLOTS,
  SLOTS_PER_OUTFIT: 3,
};
