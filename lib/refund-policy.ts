import { TIERS, ESTIMATED_DELIVERY_MINUTES, ESTIMATED_DELIVERY_LABEL } from "@/lib/tiers";

/** Canonical refund policy — legal layer only (/refund, /terms, refund FAQ). */
export const REFUND_CONTACT_EMAIL = "contact@snapprohead.com";
export const REFUND_WINDOW_DAYS = 14;

export const REFUND_GUARANTEE_LABEL = "14-day satisfaction guarantee";

export const REFUND_HERO_LINE =
  "If you don't get at least one headshot you're happy with, we'll refund your entire purchase.";

export const REFUND_WINDOW_LINE = `Contact us within ${REFUND_WINDOW_DAYS} days of purchase for a full refund.`;

export const REFUND_POLICY_SUMMARY = `${REFUND_HERO_LINE} ${REFUND_WINDOW_LINE}`;

export const REFUND_FAQ_ANSWER = `We offer a ${REFUND_WINDOW_DAYS}-day satisfaction guarantee. If you're not satisfied with your results, email ${REFUND_CONTACT_EMAIL} within ${REFUND_WINDOW_DAYS} days of purchase for a full refund. See our refund policy at snapprohead.com/refund for details.`;

export const REFUND_META_DESCRIPTION = `${REFUND_GUARANTEE_LABEL}. Full refund if you're not satisfied — contact us within ${REFUND_WINDOW_DAYS} days of purchase.`;

/** Marketing layer — hero, meta, profession pages (quality-first, no refund emphasis). */
export const TRUST_HERO_BADGE = "Privacy first · Studio-quality results";

export const TRUST_CTA_LINE = `No hidden fees · ${ESTIMATED_DELIVERY_LABEL} delivery`;

export const TRUST_CLOSING_BADGE = "Studio-quality results";

export const META_SITE_DESCRIPTION = `Generate professional AI headshots for LinkedIn, resumes, and social media in about ${ESTIMATED_DELIVERY_MINUTES} minutes. Starting at $${TIERS.starter.price} — a fraction of traditional photography.`;

export const META_HOME_DESCRIPTION = `Turn selfies into studio-quality professional headshots with AI. Starting at $${TIERS.starter.price}. Fast Flux-quality delivery in ${ESTIMATED_DELIVERY_LABEL}.`;

export const META_LOGIN_DESCRIPTION = `Sign in to SnapProHead and start generating studio-quality AI headshots in ${ESTIMATED_DELIVERY_LABEL}. Starting at $${TIERS.starter.price}.`;

export const META_PRICING_DESCRIPTION = `Choose your SnapProHead package. Professional AI headshots from $${TIERS.starter.price}. Full commercial rights · ${ESTIMATED_DELIVERY_LABEL} delivery.`;

export const PROFESSION_OG_TAGLINE = `$${TIERS.starter.price} · ${TIERS.starter.marketingImageCount}+ HD headshots · ${ESTIMATED_DELIVERY_LABEL}`;

export const PROFESSION_PAGE_CTA = `$${TIERS.starter.price}. Delivered in ${ESTIMATED_DELIVERY_LABEL}.`;

export const PROFESSION_HERO_SUFFIX = `Starting at $${TIERS.starter.price} for ${TIERS.starter.marketingImageCount}+ HD headshots.`;

/** Profession landing card — quality-first, no refund emphasis. */
export const PROFESSION_CARD_HEADLINE = `From $${TIERS.starter.price} · Studio-quality · ${ESTIMATED_DELIVERY_LABEL}`;

/** FAQ / schema — unified delivery time across profession pages. */
export const DELIVERY_FAQ_ANSWER = `About ${ESTIMATED_DELIVERY_MINUTES} minutes. Upload 4-10 selfies and our AI generates your photos.`;

export const DELIVERY_FAQ_ANSWER_40_PLUS = `About ${ESTIMATED_DELIVERY_MINUTES} minutes. Upload 4-10 selfies and our AI generates 40+ professional headshots.`;

export const DELIVERY_FAQ_STANDARD = `Standard processing takes about ${ESTIMATED_DELIVERY_MINUTES} minutes. You'll receive an email notification as soon as your headshots are ready.`;

export const DELIVERY_HERO_PHRASE = `in about ${ESTIMATED_DELIVERY_MINUTES} minutes`;

export const DELIVERY_FAQ_READY = `Most orders are ready within ${ESTIMATED_DELIVERY_MINUTES} minutes.`;

export const DELIVERY_FAQ_READY_40 = `${DELIVERY_FAQ_READY} You'll receive 40+ HD photos to choose from.`;

export const DELIVERY_FAQ_TRAINING = `The AI training takes about ${ESTIMATED_DELIVERY_MINUTES} minutes. Once complete, you'll have 40+ professional headshots ready to download.`;

/** Decision layer — pricing & checkout-adjacent (light trust + link to /refund). */
export const PRICING_TRUST_LINE = "Satisfaction guarantee";

export const PRICING_SUBHEAD =
  "Studio-quality AI portraits from your selfies. If you're not happy with usable results, we'll refund you — see our refund policy for details.";

/** Comparison tables — link to policy instead of leading with 14-day. */
export const COMPARISON_REFUND_OURS = "Fair refund policy";

/** Tier-accurate marketing lines (Basic = 40+, not 100+). */
export const STARTER_PRICE_LINE = `Starting at $${TIERS.starter.price} for ${TIERS.starter.marketingImageCount}+ HD headshots`;

export const TIER_COUNTS_LINE = `Basic: $${TIERS.starter.price} (${TIERS.starter.marketingImageCount}+ headshots), Professional: $${TIERS.professional.price} (${TIERS.professional.marketingImageCount}+), Executive: $${TIERS.executive.price} (${TIERS.executive.marketingImageCount}+).`;

export const COMPARE_STARTER_LINE = `SnapProHead starts at $${TIERS.starter.price} with ${TIERS.starter.marketingImageCount}+ headshots on Basic; Executive packs include ${TIERS.executive.marketingImageCount}+.`;

export const RETAKES_COMPARISON_LINE = `${TIERS.starter.marketingImageCount}+ looks included per pack`;
