-- One-time Razorpay checkouts and the resulting access periods.
CREATE TABLE billing_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  plan_id text NOT NULL REFERENCES plans (id),
  billing_cycle text NOT NULL CHECK (billing_cycle IN ('monthly', 'yearly')),
  amount_paise bigint NOT NULL CHECK (amount_paise > 0),
  currency text NOT NULL DEFAULT 'INR' CHECK (currency = 'INR'),
  razorpay_order_id text UNIQUE,
  razorpay_payment_id text UNIQUE,
  payment_method text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at timestamptz NOT NULL DEFAULT now(),
  paid_at timestamptz,
  access_until timestamptz
);
CREATE INDEX billing_payments_user_created_idx ON billing_payments (user_id, created_at DESC);
