// patch-prompts.js — 将 generated-prompts.txt 的内容替换到 lib/prompts.ts 中
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, 'lib', 'prompts.ts');
const GEN = path.join(__dirname, 'generated-prompts.txt');

const promptsContent = fs.readFileSync(ROOT, 'utf8');
const replacementBlock = fs.readFileSync(GEN, 'utf8');

// 找到并替换 professional 和 executive 的空数组
// 匹配:   professional: { man: [], woman: [] },\n  executive: { man: [], woman: [] },
const pattern = /\s*professional:\s*\{\s*man:\s*\[\s*\]\s*,\s*woman:\s*\[\s*\]\s*\}\s*,\s*executive:\s*\{\s*man:\s*\[\s*\]\s*,\s*woman:\s*\[\s*\]\s*\}\s*,/;

const newContent = promptsContent.replace(pattern, '\n' + replacementBlock + '\n');

if (newContent === promptsContent) {
  console.error('ERROR: 未能找到要替换的内容！文件可能格式不对。');
  process.exit(1);
}

fs.writeFileSync(ROOT, newContent, 'utf8');
console.log('✅ lib/prompts.ts 已更新！');
console.log('检查 professional 和 executive 现在是否有数据...');

// 快速验证
const check = fs.readFileSync(ROOT, 'utf8');
const profMatch = check.match(/professional:\s*\{[\s\S]*?man:\s*\[/);
const execMatch = check.match(/executive:\s*\{[\s\S]*?man:\s*\[/);
console.log('professional man array found:', !!profMatch);
console.log('executive man array found:', !!execMatch);
