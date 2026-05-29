-- supabase/migrations/20260528_add_tier.sql
-- 描述：三档定价所需的数据库变更
-- 套餐档位：starter / professional / executive

-- ============================================
-- 1. models 表：新增 tier 字段
-- ============================================
ALTER TABLE public.models
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'starter' NOT NULL;

-- 约束：tier 仅允许三个枚举值
ALTER TABLE public.models
ADD CONSTRAINT models_tier_check
CHECK (tier IN ('starter', 'professional', 'executive'));

-- ============================================
-- 2. credits 表：新增 tier 字段
-- ============================================
ALTER TABLE public.credits
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'starter' NOT NULL;

ALTER TABLE public.credits
ADD CONSTRAINT credits_tier_check
CHECK (tier IN ('starter', 'professional', 'executive'));

-- ============================================
-- 3. orders 表（新增）：独立记录每次支付
-- ============================================
CREATE TABLE IF NOT EXISTS public.orders (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    creem_checkout_id TEXT,
    creem_product_id TEXT NOT NULL,
    tier TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'paid',
    raw_payload JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- orders 表 RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 用户可查看自己的订单
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- 仅 service_role 可写入
CREATE POLICY "Service role can insert orders"
ON public.orders FOR INSERT TO service_role
WITH CHECK (true);

-- ============================================
-- 4. 现有用户数据迁移：将已有付费用户设为 starter
-- ============================================
UPDATE public.credits SET tier = 'starter' WHERE tier IS NULL;
UPDATE public.models SET tier = 'starter' WHERE tier IS NULL;

-- ============================================
-- 5. 索引
-- ============================================
CREATE INDEX IF NOT EXISTS idx_models_tier ON public.models(tier);
CREATE INDEX IF NOT EXISTS idx_credits_tier ON public.credits(tier);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
