const fs = require('fs');
const path = require('path');

const promptsPath = path.join(__dirname, '..', 'lib', 'prompts.ts');
let src = fs.readFileSync(promptsPath, 'utf8');

if (!src.includes("from './woman-prompts'")) {
  src = src.replace(
    "import type { Tier } from './tiers';",
    "import type { Tier } from './tiers';\nimport {\n  WOMAN_STARTER_PROMPTS,\n  WOMAN_PROFESSIONAL_PROMPTS,\n  WOMAN_EXECUTIVE_PROMPTS,\n} from './woman-prompts';"
  );
}

function replaceWomanBlock(tierKey, constName) {
  const re = new RegExp(
    `(  ${tierKey}: \\{\\s*\\n    man: \\[[\\s\\S]*?\\],\\s*\\n)    woman: \\[[\\s\\S]*?\\],`,
    'm'
  );
  if (!re.test(src)) {
    throw new Error(`Could not find woman block for ${tierKey}`);
  }
  src = src.replace(re, `$1    woman: ${constName},`);
}

replaceWomanBlock('starter', 'WOMAN_STARTER_PROMPTS');
replaceWomanBlock('professional', 'WOMAN_PROFESSIONAL_PROMPTS');
replaceWomanBlock('executive', 'WOMAN_EXECUTIVE_PROMPTS');

fs.writeFileSync(promptsPath, src, 'utf8');
console.log('Patched lib/prompts.ts woman arrays');
