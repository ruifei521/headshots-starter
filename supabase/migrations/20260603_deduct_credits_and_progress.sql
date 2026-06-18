-- Run in Supabase SQL Editor if not applied via CLI.
-- 1) Training progress columns  2) Atomic credit deduction for train-webhook

ALTER TABLE models
ADD COLUMN IF NOT EXISTS images_generated INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_images INTEGER DEFAULT 0;

CREATE OR REPLACE FUNCTION public.deduct_credits(p_amount integer, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  rows_updated integer;
BEGIN
  IF p_amount IS NULL OR p_amount < 1 THEN
    RETURN false;
  END IF;

  UPDATE public.credits
  SET credits = credits - p_amount
  WHERE user_id = p_user_id AND credits >= p_amount;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;
  RETURN rows_updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.deduct_credits(integer, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.deduct_credits(integer, uuid) TO service_role;
