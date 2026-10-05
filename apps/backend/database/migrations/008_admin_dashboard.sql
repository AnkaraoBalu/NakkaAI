-- Admin dashboard: admin accounts (separate from users), their sessions,
-- encrypted provider API keys, an audit log, and manual plan assignment.

CREATE TABLE admin_users (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  email         text        NOT NULL,
  password_hash text        NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz
);
CREATE UNIQUE INDEX admin_users_email_key ON admin_users (lower(email));

-- Separate from auth_tokens so a user's token can never open an admin route.
-- Admin sessions always expire.
CREATE TABLE admin_tokens (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     uuid        NOT NULL REFERENCES admin_users (id) ON DELETE CASCADE,
  token_hash   text        NOT NULL UNIQUE,
  created_at   timestamptz NOT NULL DEFAULT now(),
  last_used_at timestamptz NOT NULL DEFAULT now(),
  expires_at   timestamptz NOT NULL,
  revoked_at   timestamptz
);
CREATE INDEX admin_tokens_admin_id_idx ON admin_tokens (admin_id);

-- Our key for each AI company, AES-256-GCM encrypted with PROVIDER_KEYS_SECRET.
-- Only the last 4 characters are ever shown.
CREATE TABLE provider_keys (
  provider         text        PRIMARY KEY
                               CHECK (provider IN ('anthropic', 'openai', 'google', 'xai')),
  encrypted_key    text        NOT NULL,  -- v1:<iv>:<tag>:<ciphertext>, base64
  last4            text        NOT NULL,
  updated_at       timestamptz NOT NULL DEFAULT now(),
  updated_by       uuid        REFERENCES admin_users (id) ON DELETE SET NULL,
  last_checked_at  timestamptz,
  last_check_ok    boolean,
  last_check_error text
);

-- Who changed what. Never holds key material (only last4).
CREATE TABLE admin_audit_log (
  id         bigserial   PRIMARY KEY,
  admin_id   uuid        REFERENCES admin_users (id) ON DELETE SET NULL,
  action     text        NOT NULL,  -- e.g. 'provider_key.set', 'plan.update', 'subscription.assign'
  target     text,                  -- provider, plan id or user id
  details    jsonb       NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX admin_audit_log_created_at_idx ON admin_audit_log (created_at);

-- Plans are assigned by an admin for now (no payment gateway yet).
ALTER TABLE subscriptions
  ADD COLUMN created_at  timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN updated_at  timestamptz NOT NULL DEFAULT now(),
  ADD COLUMN assigned_by uuid REFERENCES admin_users (id) ON DELETE SET NULL;

-- A user's own usage history (Usage page, admin user detail).
CREATE INDEX usage_events_user_id_created_at_idx ON usage_events (user_id, created_at);
