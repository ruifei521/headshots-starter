/**
 * Generate lib/woman-prompts.ts from outfit / background / pose rules.
 * Run: node scripts/generate-woman-prompts.js
 */
const fs = require('fs');
const path = require('path');
const { buildStarter, buildProfessional, buildExecutive } = require('./prompt-build-shared');
const {
  STARTER_OUTFIT_IDS,
  PRO_OUTFIT_IDS,
  EXEC_OUTFIT_IDS,
  TIER_PROMPT_COUNTS,
  WOMAN_OUTFITS,
  WOMAN_CASUAL_IDS,
} = require('./outfits-config');

function emit() {
  const starter = buildStarter(WOMAN_OUTFITS, STARTER_OUTFIT_IDS, WOMAN_CASUAL_IDS, 'woman');
  const professional = buildProfessional(WOMAN_OUTFITS, PRO_OUTFIT_IDS, WOMAN_CASUAL_IDS, 'woman');
  const executive = buildExecutive(WOMAN_OUTFITS, EXEC_OUTFIT_IDS, WOMAN_CASUAL_IDS, 'woman');

  if (starter.length !== TIER_PROMPT_COUNTS.starter) {
    throw new Error(`starter woman expected ${TIER_PROMPT_COUNTS.starter}, got ${starter.length}`);
  }
  if (professional.length !== TIER_PROMPT_COUNTS.professional) {
    throw new Error(`professional woman expected ${TIER_PROMPT_COUNTS.professional}, got ${professional.length}`);
  }
  if (executive.length !== TIER_PROMPT_COUNTS.executive) {
    throw new Error(`executive woman expected ${TIER_PROMPT_COUNTS.executive}, got ${executive.length}`);
  }

  const content = `// ============================================
// lib/woman-prompts.ts — 女装 prompt（#01-#36 定稿 wearing + 背景/姿势/表情）
// 由 scripts/generate-woman-prompts.js 生成，勿手改
// Basic: ${STARTER_OUTFIT_IDS.length} outfits × 3 | Pro: ${PRO_OUTFIT_IDS.length} × 3 | Exec: ${EXEC_OUTFIT_IDS.length} × 3
// ============================================

export const WOMAN_STARTER_PROMPTS = [
${starter.join(',\n')},
];

export const WOMAN_PROFESSIONAL_PROMPTS = [
${professional.join(',\n')},
];

export const WOMAN_EXECUTIVE_PROMPTS = [
${executive.join(',\n')},
];
`;

  const outPath = path.join(__dirname, '..', 'lib', 'woman-prompts.ts');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('Wrote', outPath);
  console.log('Counts:', starter.length, professional.length, executive.length);
}

emit();
