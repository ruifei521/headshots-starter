/**
 * SnapProHead 三档定价常量
 * 重新导出 tiers.ts 中的核心数据以保持向后兼容
 *
 * 迁移说明：原 lib/pricing.ts 仅定义单包 $29 定价。
 * 现改为三档定价（Basic $29 / Professional $39 / Executive $59），
 * 核心定义统一从 lib/tiers.ts 导出，本文件保持简化兼容层。
 */

export {
  TIERS,
  CREEM_PRODUCT_IDS,
  PRODUCT_ID_TO_TIER,
  getTierInfo,
  getCreemProductId,
  getTrainingConfig,
  isTier,
  tierFromProductId,
  maxTier,
} from './tiers';

export type { Tier, TierInfo } from './tiers';

// 向后兼容：保留单包价格（最低档 Basic）
export const PRICING = {
  single: { price: 1 },       // Basic
  professional: { price: 1 },
  executive: { price: 1 },
} as const;

// 向后兼容：默认产品 ID（旧代码引用 single）
export const PRODUCT_IDS = {
  single: 'prod_fWHFyTDAhVb1xqwS71esu',  // 新 Basic Product ID
} as const;
