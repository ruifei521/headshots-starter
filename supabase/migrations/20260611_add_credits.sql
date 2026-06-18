-- Refund credits when training fails or is stale (pairs with deduct at train-model start).

CREATE OR REPLACE FUNCTION public.add_credits(p_amount integer, p_user_id uuid)
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
  SET credits = credits + p_amount
  WHERE user_id = p_user_id;

  GET DIAGNOSTICS rows_updated = ROW_COUNT;

  IF rows_updated = 0 THEN
    INSERT INTO public.credits (user_id, credits, tier)
    VALUES (p_user_id, p_amount, 'starter');
    RETURN true;
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.add_credits(integer, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.add_credits(integer, uuid) TO service_role;
