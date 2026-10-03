-- One pending sign-up verification per email (stored lowercased).
CREATE TABLE email_verifications (
  email                   text        PRIMARY KEY,
  code_hash               text        NOT NULL,
  attempts                integer     NOT NULL DEFAULT 0,
  expires_at              timestamptz NOT NULL,
  last_sent_at            timestamptz NOT NULL DEFAULT now(),
  -- Set once the code is confirmed; the token then authorizes creating the account.
  verified_at             timestamptz,
  verification_token_hash text,
  token_expires_at        timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now()
);
