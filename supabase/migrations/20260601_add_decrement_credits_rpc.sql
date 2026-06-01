-- Atomic credit decrement: prevents race conditions in train-webhook
-- Returns remaining credits after decrement, or NULL if no credits to deduct
CREATE OR REPLACE FUNCTION decrement_credits(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_credits INTEGER;
BEGIN
  UPDATE credits
  SET credits = credits - 1
  WHERE user_id = p_user_id AND credits > 0
  RETURNING credits INTO v_credits;

  RETURN v_credits;
END;
$$;
