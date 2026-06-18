import { HEADSHOT_PROFESSION_SLUGS } from "@/lib/profession-metadata";
import { TIERS } from "@/lib/tiers";

/** Average US professional headshot session cost — single marketing anchor. */
export const STUDIO_PHOTOGRAPH_AVERAGE_USD = 232;

export const STUDIO_PHOTOGRAPH_AVERAGE_LABEL = `$${STUDIO_PHOTOGRAPH_AVERAGE_USD}`;

export const STUDIO_PHOTOGRAPH_SESSION_LABEL = `$${STUDIO_PHOTOGRAPH_AVERAGE_USD}+ per session`;

export const STUDIO_PHOTOGRAPH_RANGE_LABEL = `$${STUDIO_PHOTOGRAPH_AVERAGE_USD}+ per session`;

/** Industry landing pages under /headshots/[slug]. */
export const HEADSHOT_PROFESSION_COUNT = HEADSHOT_PROFESSION_SLUGS.length;

export const HEADSHOT_PROFESSION_STYLES_SHORT = `${HEADSHOT_PROFESSION_COUNT} professional styles`;

export const BROWSE_ALL_STYLES_LINK = `Browse all ${HEADSHOT_PROFESSION_COUNT} styles →`;

export const BROWSE_ALL_STYLES_SHORT = `Browse all ${HEADSHOT_PROFESSION_COUNT} →`;

export const HERO_CHEAPER_THAN_STUDIO_LINE = `8x cheaper than a ${STUDIO_PHOTOGRAPH_AVERAGE_LABEL} photoshoot`;

export function percentCheaperThanStudio(
  packPrice = TIERS.starter.price
): number {
  return Math.round((1 - packPrice / STUDIO_PHOTOGRAPH_AVERAGE_USD) * 100);
}

export function compareVsStudioPhotographerSnippet(
  packPrice = TIERS.starter.price
): string {
  const pct = percentCheaperThanStudio(packPrice);
  return `about ${pct}% cheaper than a ${STUDIO_PHOTOGRAPH_AVERAGE_LABEL} professional photographer`;
}

/** Train flow — model name input. */
export const TRAIN_SET_NAME_LABEL = "Model Name";
export const TRAIN_SET_NAME_DESCRIPTION = "Give your AI model a recognizable name (only you will see this).";
export const TRAIN_SET_NAME_PLACEHOLDER = "e.g., My Professional Headshots";
