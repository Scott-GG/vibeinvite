-- VibeInvite PayPal Migration
-- Rename Creem-specific columns to payment-agnostic PayPal equivalents

-- purchases: creem_checkout_id -> paypal_order_id
ALTER TABLE purchases RENAME COLUMN creem_checkout_id TO paypal_order_id;

-- profiles: creem_customer_id -> paypal_subscriber_id
ALTER TABLE profiles RENAME COLUMN creem_customer_id TO paypal_subscriber_id;
