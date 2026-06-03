/**
 * SnapProHead 三档定价常量
 * 重新导出 tiers.ts 中的核心数据以保持向后兼容
 *
 * 迁移说明：原 lib/pricing.ts 仅定义单包 $29 定价。
 * 现改为三档定价（Basic $29 / Professional $39 / Executive $59），
 * 核心定义统一从 lib/tiers.ts 导出，本文件保持简化兼容层。
 */

import { TIERS, CREEM_PRODUCT_IDS } from './tiers';

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

// 向后兼容：保留单包价格（从 TIERS 读取真实价格）
export const PRICING = {
  single: { price: TIERS.starter.price },
  professional: { price: TIERS.professional.price },
  executive: { price: TIERS.executive.price },
} as const;

// 向后兼容：默认产品 ID（旧代码引用 single）
export const PRODUCT_IDS = {
  single: CREEM_PRODUCT_IDS.starter,
} as const;
