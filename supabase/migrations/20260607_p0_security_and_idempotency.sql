-- P0: Creem webhook idempotency, credits RLS hardening, training progress columns
-- Safe to run multiple times (IF NOT EXISTS / IF EXISTS guards).

-- ============================================
-- 1. Training progress columns (if missing)
-- ============================================
ALTER TABLE public.models
ADD COLUMN IF NOT EXISTS images_generated INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_images INTEGER DEFAULT 0;

-- ============================================
-- 2. Creem checkout idempotency on orders
--    Dedupe existing rows before adding unique index.
-- ============================================
DELETE FROM public.orders o
USING public.orders dup
WHERE o.creem_checkout_id IS NOT NULL
  AND o.creem_checkout_id <> ''
  AND dup.creem_checkout_id = o.creem_checkout_id
  AND dup.id < o.id;

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_creem_checkout_id_unique
ON public.orders (creem_checkout_id)
WHERE creem_checkout_id IS NOT NULL AND creem_checkout_id <> '';

-- ============================================
-- 3. Revoke self-granting credits via client RLS
--    Grants only via service_role (webhook) or RPC.
-- ============================================
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.credits;
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.credits;
