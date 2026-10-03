-- Tables for the VS Code extension: sign-in handoff, persistent tokens,
-- plans, subscriptions and usage. See the "Nakka backend — what to build" spec.

ALTER TABLE users
  ADD COLUMN signed_in_with text NOT NULL DEFAULT 'Nakka',  -- 'Google' | 'GitHub' | 'Nakka'
  ADD COLUMN workspace      text;                           -- team name, if any

-- A sign-in attempt from the extension, while the user is on the /auth page.
CREATE TABLE auth_states (
  state        text        PRIMARY KEY,
  redirect_uri text        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  used_at      timestamptz
);

-- Bearer tokens for the website ('web') and the extension ('extension').
-- Only a SHA-256 hash is stored: the tokens are 256-bit random values, so a
-- salted password hash isn't needed and would make lookups impossible.
CREATE TABLE auth_tokens (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  token_hash   text        NOT NULL UNIQUE,
  client       text        NOT NULL,  -- 'web' | 'extension'
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz,
  revoked_at   timestamptz
);
CREATE INDEX auth_tokens_user_id_idx ON auth_tokens (user_id);

CREATE TABLE plans (
  id      text  PRIMARY KEY,           -- 'free', 'pro'
  name    text  NOT NULL,              -- what the user sees
  windows jsonb NOT NULL DEFAULT '[]'  -- [{ id, label, limit, duration_hours }]
);

CREATE TABLE plan_models (
  plan_id        text NOT NULL REFERENCES plans (id) ON DELETE CASCADE,
  model_id       text NOT NULL,  -- what the user sees, e.g. 'gpt-5.5'
  provider       text NOT NULL,  -- 'openai' | 'anthropic' | 'google' | 'xai'
  upstream_model text NOT NULL,  -- the name sent to that provider
  sort_order     int  NOT NULL DEFAULT 0,
  PRIMARY KEY (plan_id, model_id)
);

CREATE TABLE subscriptions (
  user_id                uuid        PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  plan_id                text        NOT NULL REFERENCES plans (id),
  status                 text        NOT NULL,  -- 'active' | 'canceled' | 'past_due'
  stripe_customer_id     text,
  stripe_subscription_id text,
  current_period_end     timestamptz
);

-- One row per AI request: the record of what actually happened.
CREATE TABLE usage_events (
  id                bigserial   PRIMARY KEY,
  user_id           uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  model_id          text        NOT NULL,
  provider          text        NOT NULL,
  input_tokens      int         NOT NULL DEFAULT 0,
  output_tokens     int         NOT NULL DEFAULT 0,
  cache_read_tokens int         NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX usage_events_created_at_idx ON usage_events (created_at);
CREATE INDEX usage_events_user_id_idx ON usage_events (user_id);

-- Running count per allowance window, so checks don't sum usage_events.
CREATE TABLE usage_windows (
  user_id   uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  window_id text        NOT NULL,  -- '5h', 'week'
  used      int         NOT NULL DEFAULT 0,
  resets_at timestamptz NOT NULL,
  PRIMARY KEY (user_id, window_id)
);

-- Placeholder plans. Limits and models are added once they're decided; a plan
-- with no windows shows no usage meters, and one with no models lists none.
INSERT INTO plans (id, name) VALUES ('free', 'Free'), ('pro', 'Pro');
