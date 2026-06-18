// ============================================
// lib/tiers.ts — 套餐档位核心常量与类型
// 唯一数据源：所有 tier 相关常量定义在此文件
// 禁止在其他文件硬编码 tier 字符串、价格
// ============================================

import { TIER_PRIVACY_FEATURE } from "@/lib/data-retention-policy";

// ============================================
// 套餐档位类型
// ============================================
export type Tier = 'starter' | 'professional' | 'executive';

// ============================================
// 三档定价常量
// ============================================
export interface TierInfo {
  tier: Tier;
  name: string;           // 显示名称
  price: number;          // 美元价格
  originalPrice: number;  // 原价（用于划线价展示）
  priceLabel: string;     // 价格标签
  imageCount: number;     // 实际产出图片数量（prompt 系统）
  marketingImageCount: number; // 页面展示数量（给客户预期，实际略多）
  outfitStyleCount: number; // 营销展示：服装+背景套数
  backgroundCount: number;  // 与 outfitStyleCount 一致（每套含 outfit + background）
  modelBranch: 'sd15' | 'flux1';
  resolution: string;     // 分辨率描述
  estimatedTime: string;  // 预估时间
  badge?: string;         // 推荐标签（如 "Most Popular"）
  features: string[];     // 特性列表
}

/** Marketing copy: "10 outfit & background sets" */
export function formatOutfitBackgroundFeature(
  outfitStyleCount: number,
  backgroundCount: number
): string {
  if (outfitStyleCount === backgroundCount) {
    return `${outfitStyleCount} outfit & background sets`;
  }
  return `${outfitStyleCount} outfit styles & ${backgroundCount} backgrounds`;
}

/** Max outfit/background set count across tiers (pricing comparison tables). */
export const MAX_OUTFIT_STYLE_COUNT = 30;
export const MAX_BACKGROUND_COUNT = 30;
export const MAX_OUTFIT_BACKGROUND_SETS_LABEL = formatOutfitBackgroundFeature(
  MAX_OUTFIT_STYLE_COUNT,
  MAX_BACKGROUND_COUNT
);

/** Site-wide marketing delivery time — all tiers use the same ~25 min promise. */
export const ESTIMATED_DELIVERY_MINUTES = 25;
export const ESTIMATED_DELIVERY_LABEL = `~${ESTIMATED_DELIVERY_MINUTES} min`;
export const ESTIMATED_DELIVERY_LONG = `~${ESTIMATED_DELIVERY_MINUTES} minutes`;
export const ESTIMATED_DELIVERY_FEATURE = `${ESTIMATED_DELIVERY_LABEL} fast delivery`;

export const TIERS: Record<Tier, TierInfo> = {
  starter: {
    tier: 'starter',
    name: 'Basic',
    price: 29,
    originalPrice: 37,
    priceLabel: '$29',
    imageCount: 45,
    marketingImageCount: 40,
    outfitStyleCount: 10,
    backgroundCount: 10,
    modelBranch: 'flux1',
    resolution: '1024×1024',
    estimatedTime: ESTIMATED_DELIVERY_LABEL,
    features: [
      '40 HD AI headshots',
      formatOutfitBackgroundFeature(10, 10),
      'Enhanced resolution 1024×1024 (Flux)',
      ESTIMATED_DELIVERY_FEATURE,
      'Commercial license',
      TIER_PRIVACY_FEATURE,
    ],
  },
  professional: {
    tier: 'professional',
    name: 'Professional',
    price: 39,
    originalPrice: 49,
    priceLabel: '$39',
    imageCount: 66,
    marketingImageCount: 60,
    outfitStyleCount: 20,
    backgroundCount: 20,
    modelBranch: 'flux1',
    resolution: '1024×1024',
    estimatedTime: ESTIMATED_DELIVERY_LABEL,
    badge: 'Most Popular',
    features: [
      '60 HD AI headshots',
      formatOutfitBackgroundFeature(20, 20),
      'Enhanced resolution 1024×1024 (Flux)',
      ESTIMATED_DELIVERY_FEATURE,
      'Commercial license',
      TIER_PRIVACY_FEATURE,
    ],
  },
  executive: {
    tier: 'executive',
    name: 'Executive',
    price: 59,
    originalPrice: 74,
    priceLabel: '$59',
    imageCount: 108,
    marketingImageCount: 100,
    outfitStyleCount: 30,
    backgroundCount: 30,
    modelBranch: 'flux1',
    resolution: '1024×1024',
    estimatedTime: ESTIMATED_DELIVERY_LABEL,
    badge: 'Best Value',
    features: [
      '100 HD AI headshots',
      formatOutfitBackgroundFeature(30, 30),
      'Enhanced resolution 1024×1024 (Flux)',
      ESTIMATED_DELIVERY_FEATURE,
      'Commercial license',
      TIER_PRIVACY_FEATURE,
    ],
  },
};

// ============================================
// Creem Product ID 映射
// ============================================
export const CREEM_PRODUCT_IDS: Record<Tier, string> = {
  starter:      'prod_fWHFyTDAhVb1xqwS71esu',
  professional: 'prod_453s1kOCIVZECDNqx9z1o3',
  executive:    'prod_4Bcd1ZArXQXbWl7GWkxzUe',
};

// 反向映射：product_id → tier（仅当前三档 Creem 产品）
export const PRODUCT_ID_TO_TIER: Record<string, Tier> = {
  'prod_fWHFyTDAhVb1xqwS71esu': 'starter',
  'prod_453s1kOCIVZECDNqx9z1o3': 'professional',
  'prod_4Bcd1ZArXQXbWl7GWkxzUe': 'executive',
};

// ============================================
// tier → 训练参数映射
// ============================================
/**
 * 根据 tier 获取训练配置
 * - branch：AI 模型分支（所有套餐统一使用 flux1）
 *
 * Prompt 生成：在 train-model 创建 tune 时通过 prompts_attributes 一并提交，
 * Astria 训练完成后自动跑所有 prompts，每个完成时回调 prompt-webhook
 */
export function getTrainingConfig(tier: Tier): {
  branch: 'sd15' | 'flux1';
} {
  const info = TIERS[tier];
  return {
    branch: info.modelBranch,
  };
}

// ============================================
// 辅助函数
// ============================================

/** 类型守卫：检查字符串是否为合法 Tier */
export function isTier(value: string): value is Tier {
  return ['starter', 'professional', 'executive'].includes(value);
}

/** 安全获取 TierInfo，未知值默认返回 starter */
export function getTierInfo(tier: string): TierInfo {
  return isTier(tier) ? TIERS[tier] : TIERS['starter'];
}

/** 根据 tier 获取 Creem Product ID */
export function getCreemProductId(tier: Tier): string {
  return CREEM_PRODUCT_IDS[tier];
}

/** 根据 Creem product_id 映射 tier；未知 ID 返回 null（webhook 应拒绝处理） */
export function tierFromProductId(productId: string): Tier | null {
  return PRODUCT_ID_TO_TIER[productId] ?? null;
}

/** Validate tier from checkout URL / API body. */
export function parseCheckoutTier(value: string | null | undefined): Tier | null {
  if (!value || !isTier(value)) return null;
  return value;
}

/** tier 升级比较：返回较高的 tier */
export function maxTier(a: string, b: string): Tier {
  const order: Record<string, number> = { 'starter': 0, 'professional': 1, 'executive': 2 };
  const aVal = order[a] ?? -1;
  const bVal = order[b] ?? -1;
  return aVal >= bVal ? (isTier(a) ? a : 'starter') : (isTier(b) ? b : 'starter');
}
