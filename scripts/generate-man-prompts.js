/**
 * Generate lib/man-prompts.ts from outfit / background / pose rules.
 * Run: node scripts/generate-man-prompts.js
 */
const fs = require('fs');
const path = require('path');
const { buildStarter, buildProfessional, buildExecutive } = require('./prompt-build-shared');
const {
  STARTER_OUTFIT_IDS,
  PRO_OUTFIT_IDS,
  EXEC_OUTFIT_IDS,
  TIER_PROMPT_COUNTS,
  MAN_OUTFITS,
  MAN_CASUAL_IDS,
} = require('./outfits-config');

function emit() {
  const starter = buildStarter(MAN_OUTFITS, STARTER_OUTFIT_IDS, MAN_CASUAL_IDS, 'man');
  const professional = buildProfessional(MAN_OUTFITS, PRO_OUTFIT_IDS, MAN_CASUAL_IDS, 'man');
  const executive = buildExecutive(MAN_OUTFITS, EXEC_OUTFIT_IDS, MAN_CASUAL_IDS, 'man');

  if (starter.length !== TIER_PROMPT_COUNTS.starter) {
    throw new Error(`starter man expected ${TIER_PROMPT_COUNTS.starter}, got ${starter.length}`);
  }
  if (professional.length !== TIER_PROMPT_COUNTS.professional) {
    throw new Error(`professional man expected ${TIER_PROMPT_COUNTS.professional}, got ${professional.length}`);
  }
  if (executive.length !== TIER_PROMPT_COUNTS.executive) {
    throw new Error(`executive man expected ${TIER_PROMPT_COUNTS.executive}, got ${executive.length}`);
  }

  const content = `// ============================================
// lib/man-prompts.ts — 男装 prompt（#01-#36 定稿 wearing + 背景/姿势/表情）
// 由 scripts/generate-man-prompts.js 生成，勿手改
// Basic: ${STARTER_OUTFIT_IDS.length} outfits × 3 | Pro: ${PRO_OUTFIT_IDS.length} × 3 | Exec: ${EXEC_OUTFIT_IDS.length} × 3
// ============================================

export const MAN_STARTER_PROMPTS = [
${starter.join(',\n')},
];

export const MAN_PROFESSIONAL_PROMPTS = [
${professional.join(',\n')},
];

export const MAN_EXECUTIVE_PROMPTS = [
${executive.join(',\n')},
];
`;

  const outPath = path.join(__dirname, '..', 'lib', 'man-prompts.ts');
  fs.writeFileSync(outPath, content, 'utf8');
  console.log('Wrote', outPath);
  console.log('Counts:', starter.length, professional.length, executive.length);
}

emit();
