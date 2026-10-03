-- One row per Google/GitHub account connected to a Nakka user, so one user can
-- have several (including ones whose email differs from the account email).
CREATE TABLE user_identities (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  provider         text        NOT NULL,  -- 'google' | 'github'
  provider_user_id text        NOT NULL,  -- the provider's own ID for the account
  clerk_user_id    text        NOT NULL,
  email            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (provider, provider_user_id)
);
CREATE INDEX user_identities_user_id_idx ON user_identities (user_id);

-- Links now live in user_identities. Existing links are re-created automatically
-- (by verified email) the next time that person signs in with Google/GitHub.
DROP INDEX users_clerk_user_id_key;
ALTER TABLE users DROP COLUMN clerk_user_id;
