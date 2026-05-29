// ============================================
// lib/tiers.ts — 套餐档位核心常量与类型
// 唯一数据源：所有 tier 相关常量定义在此文件
// 禁止在其他文件硬编码 tier 字符串、价格
// ============================================

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
  priceLabel: string;     // 价格标签
  imageCount: number;     // 产出图片数量
  modelBranch: 'sd15' | 'flux';
  resolution: string;     // 分辨率描述
  estimatedTime: string;  // 预估时间
  badge?: string;         // 推荐标签（如 "Most Popular"）
  features: string[];     // 特性列表
}

export const TIERS: Record<Tier, TierInfo> = {
  starter: {
    tier: 'starter',
    name: 'Basic',
    price: 29,
    priceLabel: '$29',
    imageCount: 40,
    modelBranch: 'sd15',
    resolution: '512×768',
    estimatedTime: '~45 分钟',
    features: [
      '40 张 AI 专业头像',
      '10 种风格场景',
      '标准分辨率 512×768',
      '~45 分钟交付',
      '商业授权',
      '30 天自动删除保护隐私',
    ],
  },
  professional: {
    tier: 'professional',
    name: 'Professional',
    price: 39,
    priceLabel: '$39',
    imageCount: 60,
    modelBranch: 'sd15',
    resolution: '512×768',
    estimatedTime: '~40 分钟',
    badge: 'Most Popular',
    features: [
      '60 张 AI 专业头像',
      '15 种风格场景',
      '标准分辨率 512×768',
      '~40 分钟交付',
      '商业授权',
      '30 天自动删除保护隐私',
    ],
  },
  executive: {
    tier: 'executive',
    name: 'Executive',
    price: 59,
    priceLabel: '$59',
    imageCount: 100,
    modelBranch: 'flux',
    resolution: '1024×1024',
    estimatedTime: '~25 分钟',
    badge: 'Best Value',
    features: [
      '100 张 AI 专业头像',
      '25 种风格场景',
      '增强分辨率 1024×1024 (Flux)',
      '~25 分钟快速交付',
      '商业授权',
      '30 天自动删除保护隐私',
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

// 反向映射：product_id → tier
export const PRODUCT_ID_TO_TIER: Record<string, Tier> = {
  'prod_fWHFyTDAhVb1xqwS71esu': 'starter',
  'prod_453s1kOCIVZECDNqx9z1o3': 'professional',
  'prod_4Bcd1ZArXQXbWl7GWkxzUe': 'executive',
  // 向后兼容：旧 product_id 映射为 starter
  'prod_31zqeJaVi4nCiCLGPz0F2K': 'starter',
  'prod_6F4zKTNhL3V7vWPUhnjZDZ': 'starter',
  // 向后兼容：旧 professional/executive product_id
  'prod_198ewWuQouDaQfEOT6kTvj': 'professional',
  'prod_1pZIlgHsKVk5YOK1QupnPP': 'executive',
};

// ============================================
// tier → 训练参数映射
// ============================================
/**
 * 根据 tier 获取训练配置
 * - branch：AI 模型分支（starter/professional → sd15，executive → flux）
 *
 * Prompt 生成：在 train-model 创建 tune 时通过 prompts_attributes 一并提交，
 * Astria 训练完成后自动跑所有 prompts，每个完成时回调 prompt-webhook
 */
export function getTrainingConfig(tier: Tier): {
  branch: 'sd15' | 'flux';
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

/** 根据 Creem product_id 映射 tier（含向后兼容） */
export function tierFromProductId(productId: string): Tier {
  return PRODUCT_ID_TO_TIER[productId] || 'starter';
}

/** tier 升级比较：返回较高的 tier */
export function maxTier(a: string, b: string): Tier {
  const order: Record<string, number> = { 'starter': 0, 'professional': 1, 'executive': 2 };
  const aVal = order[a] ?? -1;
  const bVal = order[b] ?? -1;
  return aVal >= bVal ? (isTier(a) ? a : 'starter') : (isTier(b) ? b : 'starter');
}
