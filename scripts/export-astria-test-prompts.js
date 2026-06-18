/**
 * Export all finalized Astria prompts to docs/ASTRIA_TEST_PROMPTS.md
 * Run: node scripts/export-astria-test-prompts.js
 */
const fs = require('fs');
const path = require('path');
const {
  WOMAN_SLOTS,
  MAN_SLOTS,
  SLOTS_PER_OUTFIT,
} = require('./prompt-build-shared');
const {
  EXEC_OUTFIT_IDS,
  WOMAN_OUTFITS,
  MAN_OUTFITS,
  WOMAN_CASUAL_IDS,
  MAN_CASUAL_IDS,
  TIER_PROMPT_COUNTS,
} = require('./outfits-config');

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

function buildPromptText(gender, tier, outfitId, slotIndex, outfits, casualIds) {
  const slot = gender === 'woman' ? WOMAN_SLOTS[slotIndex] : MAN_SLOTS[slotIndex];
  const prefix = prefixFor(tier, outfitId, casualIds);
  const wearing = outfits[outfitId];
  const parts = [`ohwx ${gender}`];
  if (slot.framing) parts.push(slot.framing);
  parts.push(slot.pose);
  parts.push(prefix);
  if (slot.expression) parts.push(slot.expression);
  parts.push(`wearing ${wearing}`);
  parts.push(slot.lighting);
  parts.push(slot.bg);
  return parts.join(', ');
}

const SLOT_LABELS = ['Slot A · front · white', 'Slot B · 3/4 · grey', 'Slot C · arms crossed · white'];

function sectionForGender(gender, outfits, casualIds) {
  const lines = [];
  lines.push(`## ${gender === 'woman' ? 'Woman' : 'Man'} — Executive tier (${EXEC_OUTFIT_IDS.length} outfits × 3 = ${EXEC_OUTFIT_IDS.length * 3} prompts)`);
  lines.push('');
  lines.push('Astria dashboard: `<lora:TUNE_ID:1.0>` + prompt below. Settings: **Photographic**, Super Resolution **ON**, Inpaint faces **OFF**, face_correct **OFF**, face_swap **OFF**.');
  lines.push('');

  for (const id of EXEC_OUTFIT_IDS) {
    lines.push(`### #${id} — ${outfits[id]}`);
    lines.push('');
    for (let s = 0; s < SLOTS_PER_OUTFIT; s++) {
      const text = buildPromptText(gender, 'executive', id, s, outfits, casualIds);
      lines.push(`**${SLOT_LABELS[s]}**`);
      lines.push('```');
      lines.push(text);
      lines.push('```');
      lines.push('');
    }
  }
  return lines.join('\n');
}

const header = `# Astria Test Prompts — Full Catalog

Generated: ${new Date().toISOString().slice(0, 10)}

| Tier | Outfits | Prompts | Marketing |
|------|---------|---------|-----------|
| Basic | 15 | ${TIER_PROMPT_COUNTS.starter} | 45 HD |
| Professional | 22 | ${TIER_PROMPT_COUNTS.professional} | 66 HD |
| Executive | 36 | ${TIER_PROMPT_COUNTS.executive} | 108 HD |

**Slot template (all outfits):**
- **A:** tight close-up, collarbone crop, front-facing, even studio light, white bg
- **B:** tight close-up, three-quarter view turned right, woman: warm closed-lip smile, grey bg
- **C:** front-facing arms crossed, even studio light, white bg (natural skin, no catchlight words)

---

`;

const body = [
  sectionForGender('woman', WOMAN_OUTFITS, WOMAN_CASUAL_IDS),
  '---',
  '',
  sectionForGender('man', MAN_OUTFITS, MAN_CASUAL_IDS),
].join('\n');

const outPath = path.join(__dirname, '..', 'docs', 'ASTRIA_TEST_PROMPTS.md');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, header + body, 'utf8');
console.log('Wrote', outPath);
console.log('Executive prompts per gender:', EXEC_OUTFIT_IDS.length * 3);
