// ============================================
// lib/prompts.ts — 三档位 Prompt 模板（男女分开）
// 唯一数据源：prompt 模板定义在此文件 + woman-prompts / man-prompts
// Basic=45条, Professional=66条, Executive=108条 (15/22/36 outfits × 3 slots)
// 每条 prompt num_images=1，共 N 条对应 N 张图
// 风格档：商务正装 + 商务休闲（CASUAL_IDS 判定前缀）
// ============================================

import type { Tier } from './tiers';
import {
  WOMAN_STARTER_PROMPTS,
  WOMAN_PROFESSIONAL_PROMPTS,
  WOMAN_EXECUTIVE_PROMPTS,
} from './woman-prompts';
import {
  MAN_STARTER_PROMPTS,
  MAN_PROFESSIONAL_PROMPTS,
  MAN_EXECUTIVE_PROMPTS,
} from './man-prompts';

export interface PromptTemplate {
  /** prompt 文本，{type} 会被替换为 man 或 woman */
  text: string;
  /** 每条 prompt 生成几张图，统一为 1 */
  num_images: number;
}

// ============================================
// 三档位图片数量
// ============================================
export const TIER_IMAGE_COUNTS: Record<Tier, number> = {
  starter: 45,
  professional: 66,
  executive: 108,
};

// ============================================
// 通用 Prompt 工具函数
// ============================================

/** 将模板中的 {type} 替换为实际值 */
export function fillPromptTemplate(template: string, type: string): string {
  return template.replace(/\{type\}/g, type);
}

/** 获取某档位某性别的所有 prompt，并替换 {type} 占位符 */
export function getTierPrompts(tier: Tier, type: string): PromptTemplate[] {
  // Man: 取全部男模板（不打折）
  if (type === 'man') {
    const templates = TIER_PROMPT_TEMPLATES[tier]['man'];
    return templates.map(t => ({
      text: fillPromptTemplate(t.text, 'man'),
      num_images: t.num_images,
    }));
  }

  // Woman: 取全部女模板（不打折）
  if (type === 'woman') {
    const templates = TIER_PROMPT_TEMPLATES[tier]['woman'];
    return templates.map(t => ({
      text: fillPromptTemplate(t.text, 'woman'),
      num_images: t.num_images,
    }));
  }

  // 兜底：未知类型按 man 处理
  const templates = TIER_PROMPT_TEMPLATES[tier]['man'];
  return templates.map(t => ({
    text: fillPromptTemplate(t.text, 'man'),
    num_images: t.num_images,
  }));
}

// ============================================
// Prompt 模板定义（男女分开）
// 定稿格式见 scripts/prompt-build-shared.js
// Basic: 15 outfits × 3 | Pro: 22 × 3 | Exec: 36 × 3
// ============================================

export const TIER_PROMPT_TEMPLATES: Record<
  Tier,
  Record<'man' | 'woman', PromptTemplate[]>
> = {
  starter: {
    man: MAN_STARTER_PROMPTS,
    woman: WOMAN_STARTER_PROMPTS,
  },

  professional: {
    man: MAN_PROFESSIONAL_PROMPTS,
    woman: WOMAN_PROFESSIONAL_PROMPTS,
  },

  executive: {
    man: MAN_EXECUTIVE_PROMPTS,
    woman: WOMAN_EXECUTIVE_PROMPTS,
  },
};
