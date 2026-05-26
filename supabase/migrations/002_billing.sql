-- Add billing fields to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free';
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS creem_customer_id TEXT;

-- Add pro flag to events (unlocks AI, seating, unlimited guests)
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS is_pro BOOLEAN NOT NULL DEFAULT false;

-- Purchase records for one-time event upgrades & subscriptions
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  creem_checkout_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('pro_event', 'subscription')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- If purchases table already existed with old Stripe columns, migrate them
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'stripe_session_id'
  ) THEN
    ALTER TABLE purchases RENAME COLUMN stripe_session_id TO creem_checkout_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'stripe_price_id'
  ) THEN
    ALTER TABLE purchases DROP COLUMN stripe_price_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'pingpong_transaction_id'
  ) THEN
    ALTER TABLE purchases DROP COLUMN pingpong_transaction_id;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'pingpong_contract_token'
  ) THEN
    ALTER TABLE purchases DROP COLUMN pingpong_contract_token;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'purchases' AND column_name = 'creem_checkout_id'
    AND column_name <> 'stripe_session_id'
  ) THEN
    -- Only add if the rename above didn't handle it
    IF NOT EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'purchases' AND column_name = 'creem_checkout_id'
    ) THEN
      ALTER TABLE purchases ADD COLUMN creem_checkout_id TEXT;
    END IF;
  END IF;
END $$;

-- Drop old Stripe customer index
DROP INDEX IF EXISTS idx_profiles_stripe_customer;
DROP INDEX IF EXISTS idx_purchases_token;

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

-- Recreate policy (drop first to avoid conflict)
DROP POLICY IF EXISTS "Users can read own purchases" ON purchases;
CREATE POLICY "Users can read own purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Create index for quick lookup (use IF NOT EXISTS syntax)
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_event_id ON purchases(event_id);
CREATE INDEX IF NOT EXISTS idx_profiles_creem_customer ON profiles(creem_customer_id);
