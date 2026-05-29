// generate-prompts.js — 生成 professional + executive 档位的 prompt 数据
const fs = require('fs');

const LIGHTINGS = [
  'soft studio lighting',
  'natural window lighting from left',
  'golden hour warm light',
  'soft morning daylight',
  'bright even studio lighting',
  'warm desk lamp lighting',
  'overcast soft daylight',
  'warm afternoon sunlight',
  'dramatic Rembrandt lighting from left',
  'blue hour ambient city light',
  'butterfly lighting from above',
  'ring light illumination',
  'warm sunset light',
  'mixed neon and natural light',
  'colored gel accent lighting',
  'soft dappled sunlight',
  'bright diffused daylight',
  'morning natural sunlight',
  'warm golden hour glow',
  'evening city ambient light',
];

const BACKGROUNDS = [
  'plain white background',
  'light grey seamless background',
  'dark charcoal studio background',
  'soft off-white studio background',
  'neutral taupe studio background',
  'modern glass office background',
  'executive office with bookshelf background',
  'modern urban skyline background',
  'modern cityscape background',
  'downtown cityscape background',
  'modern plaza with fountain background',
  'open green field background',
  'tree-lined park background',
  'calm lake and mountain background',
  'lakeside background',
  'forest trail background',
  'city sidewalk cafe background',
  'garden setting with flowers background',
  'executive desk with laptop background',
  'industrial loft office background',
  'modern co-working office background',
  'open plan office with plants background',
  'city park edge with buildings background',
  'urban street with storefronts background',
  'vibrant city street art mural background',
  'scenic hilltop with sunset view background',
  'minimalist dark studio background',
  'modern startup office with neon signs background',
  'glass-walled conference room background',
  'city steps and modern building background',
];

// 男装：商务专业
const MAN_BP = [
  'navy blue business suit with white dress shirt and navy silk tie',
  'charcoal grey business suit with light blue dress shirt and charcoal tie',
  'black tailored business suit with white shirt and black tie',
  'navy pinstripe business suit with white shirt and burgundy tie',
  'dark grey business suit with white shirt and silver patterned tie',
  'navy blue suit with crisp white shirt no tie',
  'charcoal suit with light grey shirt',
  'black business suit with white shirt and thin black tie',
  'dark grey business suit with light blue shirt and blue patterned tie',
  'navy blue business suit with sky blue shirt and navy tie',
];

// 男装：商务休闲
const MAN_BC = [
  'navy blazer over white open collar dress shirt',
  'charcoal crewneck sweater over collared shirt',
  'light blue button-down shirt sleeves rolled',
  'tan cotton blazer over white shirt no tie',
  'navy v-neck sweater over white collared shirt',
  'olive green casual blazer over beige button-down',
];

// 男装：时尚休闲
const MAN_SC = [
  'mustard colored knit sweater over white t-shirt',
  'camel colored casual blazer over black t-shirt',
  'olive green field jacket over denim shirt',
  'burgundy cashmere sweater',
  'navy striped knit polo sweater',
];

// 女装：商务专业
const WOMAN_BP = [
  'structured navy blue blazer with white button-down blouse',
  'charcoal grey tailored suit with light blue shell blouse',
  'black tailored blazer with white v-neck blouse',
  'navy blue blazer with silver patterned blouse',
  'charcoal suit with emerald green blouse',
  'black blazer with burgundy silk blouse',
  'deep navy sheath dress with matching blazer',
  'charcoal grey blazer with white shirt in open-collar style',
  'black tailored blazer with cream silk blouse',
  'navy fitted suit with powder blue blouse',
];

// 女装：商务休闲
const WOMAN_BC = [
  'navy blue fitted blazer over white open collar shirt',
  'soft pink cashmere cardigan over white blouse',
  'white button-down shirt with sleeves rolled',
  'beige relaxed blazer over cream camisole',
  'light grey boyfriend blazer over white shirt',
  'soft blue knit cardigan over white button-down',
];

// 女装：时尚休闲
const WOMAN_SC = [
  'rust orange knit sweater over white camisole',
  'emerald green statement blazer over black top',
  'denim jacket over floral midi dress',
  'beige cashmere turtleneck',
  'coral pink knit sweater over white tank top',
];

function makeLine(style, clothing, lighting, bg) {
  return `      { text: \`${style} of ohwx {type}, aspect ratio 4:5, centered composition, subject occupies 75% of frame height, wearing ${clothing}, ${lighting}, ${bg}, photorealistic\`, num_images: 1 },`;
}

function generate(gender, count, tier) {
  const isMan = gender === 'man';
  const bpPool = isMan ? MAN_BP : WOMAN_BP;
  const bcPool = isMan ? MAN_BC : WOMAN_BC;
  const scPool = isMan ? MAN_SC : WOMAN_SC;

  const bpN = Math.round(count * 0.55);
  const bcN = Math.round(count * 0.30);
  const scN = count - bpN - bcN;

  const bpStyle = tier === 'executive'
    ? 'luxury executive portrait'
    : tier === 'professional'
      ? 'high-end professional corporate headshot'
      : 'professional corporate headshot';

  const bcStyle = tier === 'executive'
    ? 'executive business casual portrait'
    : 'business casual headshot';

  const scStyle = tier === 'executive'
    ? 'executive smart casual portrait'
    : 'smart casual portrait';

  const lines = [];

  for (let i = 0; i < bpN; i++) {
    const clothing = bpPool[i % bpPool.length];
    const lighting = LIGHTINGS[i % LIGHTINGS.length];
    const bg = BACKGROUNDS[i % BACKGROUNDS.length];
    lines.push(makeLine(bpStyle, clothing, lighting, bg));
  }
  for (let i = 0; i < bcN; i++) {
    const clothing = bcPool[i % bcPool.length];
    const lighting = LIGHTINGS[(i + 7) % LIGHTINGS.length];
    const bg = BACKGROUNDS[(i + 11) % BACKGROUNDS.length];
    lines.push(makeLine(bcStyle, clothing, lighting, bg));
  }
  for (let i = 0; i < scN; i++) {
    const clothing = scPool[i % scPool.length];
    const lighting = LIGHTINGS[(i + 14) % LIGHTINGS.length];
    const bg = BACKGROUNDS[(i + 18) % BACKGROUNDS.length];
    lines.push(makeLine(scStyle, clothing, lighting, bg));
  }

  return lines;
}

// 生成 professional: 60×2
const profMan = generate('man', 60, 'professional');
const profWoman = generate('woman', 60, 'professional');

// 生成 executive: 100×2
const execMan = generate('man', 100, 'executive');
const execWoman = generate('woman', 100, 'executive');

const tsBlock = `  // =========================================================================
  // ── Professional (60 条 × 男女 = 各 60 条) ──
  //  商务专业 33条(55%) | 商务休闲 18条(30%) | 时尚休闲 9条(15%)
  // =========================================================================
  professional: {
    man: [
${profMan.join('\n')}
    ],
    woman: [
${profWoman.join('\n')}
    ],
  },

  // =========================================================================
  // ── Executive (100 条 × 男女 = 各 100 条) ──
  //  商务专业 55条(55%) | 商务休闲 30条(30%) | 时尚休闲 15条(15%)
  // =========================================================================
  executive: {
    man: [
${execMan.join('\n')}
    ],
    woman: [
${execWoman.join('\n')}
    ],
  },`;

fs.writeFileSync('generated-prompts.txt', tsBlock);
console.log('Done!');
console.log('Professional man:', profMan.length);
console.log('Professional woman:', profWoman.length);
console.log('Executive man:', execMan.length);
console.log('Executive woman:', execWoman.length);
console.log('---');
console.log('Paste the contents of generated-prompts.txt into lib/prompts.ts');
