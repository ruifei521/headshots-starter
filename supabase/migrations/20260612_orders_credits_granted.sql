-- Track whether purchase credits were applied for each Creem checkout.
-- Enables webhook retries to fulfill credits when order insert succeeded but credit grant failed.

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS credits_granted BOOLEAN NOT NULL DEFAULT false;

-- Historical paid orders were fulfilled atomically before this column existed.
UPDATE public.orders
SET credits_granted = true
WHERE status = 'paid' AND credits_granted = false;
