/**
 * Outfit IDs and wearing descriptions — shared by generate-*-prompts.js
 *
 * Tiers (3 prompts per outfit):
 *   Starter:      15 outfits → 45 images
 *   Professional: 22 outfits → 66 images
 *   Executive:    36 outfits → 108 images
 *
 * Formal vs casual (~60:40): CASUAL_IDS drives tier prefix in prompts.
 */

/** @typedef {Record<string, string>} OutfitMap */

/** Starter: 15 outfits — LinkedIn staples, ~9 formal / 6 casual */
const STARTER_OUTFIT_IDS = [
  '09', '06', '16', '03', '13', '01', '17', '08', '30', '19',
  '07', '05', '02', '22', '04',
];

/** Professional: starter + 7 more — 22 outfits total, ~13 formal / 9 casual */
const PRO_OUTFIT_IDS = [
  ...STARTER_OUTFIT_IDS,
  '24', '27', '15', '23', '18', '21', '28',
];

/** Executive: full catalog #01–#36 — ~22 formal / 14 casual */
const EXEC_OUTFIT_IDS = Array.from({ length: 36 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

const TIER_OUTFIT_COUNTS = {
  starter: STARTER_OUTFIT_IDS.length,
  professional: PRO_OUTFIT_IDS.length,
  executive: EXEC_OUTFIT_IDS.length,
};

const TIER_PROMPT_COUNTS = {
  starter: STARTER_OUTFIT_IDS.length * 3,
  professional: PRO_OUTFIT_IDS.length * 3,
  executive: EXEC_OUTFIT_IDS.length * 3,
};

/** @type {OutfitMap} */
const WOMAN_OUTFITS = {
  '01': 'crisp white button-down blouse, no blazer',
  '02': 'black blazer over black shell top',
  '03': 'black blazer over white v-neck shell blouse',
  '04': 'deep burgundy button-down blouse, no blazer',
  '05': 'black fine-knit polo sweater',
  '06': 'navy blazer over light blue blouse',
  '07': 'taupe blazer over white v-neck shell blouse',
  '08': 'navy blazer over black shell top',
  '09': 'navy blazer over white button-down blouse',
  '10': 'black fine-knit turtleneck sweater, no blazer',
  '11': 'black fine-ribbed crew-neck knit top, no blazer',
  '12': 'jet black button-down blouse, no blazer',
  '13': 'navy blazer over white crew-neck t-shirt',
  '14': 'white open blazer over dusty mauve shell blouse',
  '15': 'blush pink blazer over white v-neck shell blouse',
  '16': 'charcoal grey blazer over white button-down blouse',
  '17': 'light blue button-down blouse with rolled sleeves, no blazer',
  '18': 'charcoal grey blazer over white scoop-neck shell top',
  '19': 'deep burgundy fine-knit crew-neck sweater, no blazer',
  '20': 'matte black v-neck t-shirt, no blazer',
  '21': 'charcoal grey fine-knit crew-neck sweater, no blazer',
  '22': 'charcoal grey blazer over cream silk shell blouse',
  '23': 'emerald green blazer over cream turtleneck sweater',
  '24': 'black blazer over black fine-knit turtleneck sweater',
  '25': 'tan camel button-down blouse, no blazer',
  '26': 'light beige mock-neck knit sweater, no blazer',
  '27': 'charcoal grey blazer over light blue-gray blouse',
  '28': 'vibrant red blazer over black turtleneck sweater',
  '29': 'black tailored professional sheath dress',
  '30': 'black blazer over white button-down blouse, fully buttoned',
  '31': 'soft sage green blazer over white v-neck shell blouse',
  '32': 'navy fine-knit cardigan over white button-down blouse',
  '33': 'black double-breasted blazer over white crew-neck t-shirt',
  '34': 'camel tan blazer over black fine-knit turtleneck sweater',
  '35': 'steel blue structured blazer over white silk shell blouse',
  '36': 'classic navy tailored blazer dress with structured shoulders',
};

/** @type {OutfitMap} */
const MAN_OUTFITS = {
  '01': 'white dress shirt with slim black tie, no jacket',
  '02': 'black tuxedo jacket with white wing-collar shirt and black bow tie',
  '03': 'black business suit with white shirt and navy tie',
  '04': 'light grey blazer over burgundy turtleneck sweater',
  '05': 'navy quarter-zip sweater over white dress shirt collar',
  '06': 'navy blazer over striped dress shirt with navy tie',
  '07': 'charcoal grey business suit with white shirt and solid blue tie',
  '08': 'navy blazer over black crew-neck t-shirt',
  '09': 'navy business suit with white shirt and solid navy silk tie',
  '10': 'black fine-ribbed mock-neck sweater, no blazer',
  '11': 'cream dinner jacket with white wing-collar shirt and black bow tie',
  '12': 'jet black dress shirt, top button open, no tie',
  '13': 'navy blazer over white dress shirt, no tie',
  '14': 'light grey blazer over white dress shirt, no tie',
  '15': 'navy pinstripe suit with white shirt and black tie',
  '16': 'charcoal grey blazer over light blue dress shirt, no tie',
  '17': 'light blue oxford dress shirt, no jacket no tie',
  '18': 'charcoal grey business suit with light blue shirt and navy tie',
  '19': 'deep burgundy fine-knit crew-neck sweater, no blazer',
  '20': 'dark navy bomber jacket over white t-shirt',
  '21': 'black crew-neck sweater over light blue dress shirt collar',
  '22': 'light grey business suit with white shirt and charcoal tie',
  '23': 'emerald green blazer over light grey shirt with black tie',
  '24': 'black three-piece suit with white shirt and black tie',
  '25': 'light blue blazer over white dress shirt, no tie',
  '26': 'cream v-neck sweater over light blue dress shirt collar',
  '27': 'navy blazer over light blue dress shirt, no tie',
  '28': 'charcoal grey business suit with white shirt and solid red tie',
  '29': 'navy three-piece suit with white shirt and silver-grey tie',
  '30': 'black business suit with white shirt and black tie',
  '31': 'medium grey business suit with white shirt and burgundy tie',
  '32': 'navy knit sport coat over white dress shirt, no tie',
  '33': 'light grey business suit with light blue shirt and navy tie',
  '34': 'charcoal grey blazer over black fine-knit turtleneck, no tie',
  '35': 'dark navy two-button suit with white shirt and subtle grey tie',
  '36': 'charcoal herringbone blazer with white dress shirt and navy tie',
};

/** Blazer / suit / structured dress → formal prefix; knit / tee / open-collar → casual */
const WOMAN_CASUAL_IDS = new Set([
  '01', '04', '05', '10', '11', '12', '17', '19', '20', '21', '25', '26', '32', '34',
]);

const MAN_CASUAL_IDS = new Set([
  '01', '04', '05', '10', '12', '17', '19', '20', '21', '25', '26', '32', '34',
]);

module.exports = {
  STARTER_OUTFIT_IDS,
  PRO_OUTFIT_IDS,
  EXEC_OUTFIT_IDS,
  TIER_OUTFIT_COUNTS,
  TIER_PROMPT_COUNTS,
  WOMAN_OUTFITS,
  MAN_OUTFITS,
  WOMAN_CASUAL_IDS,
  MAN_CASUAL_IDS,
};
