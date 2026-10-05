-- Migration 005 moved social identities out of users and removed this column.
-- Email/password Clerk users also need a stable link, without a social identity.
ALTER TABLE users ADD COLUMN clerk_user_id text;
CREATE UNIQUE INDEX users_clerk_user_id_key ON users (clerk_user_id);

-- Restore social links only when both sides are unambiguous. Other accounts
-- link by verified email on their next successful Clerk sign-in.
WITH candidates AS (
  SELECT user_id, min(clerk_user_id) AS clerk_user_id
  FROM user_identities
  GROUP BY user_id
  HAVING count(DISTINCT clerk_user_id) = 1
), unique_links AS (
  SELECT clerk_user_id
  FROM candidates
  GROUP BY clerk_user_id
  HAVING count(*) = 1
)
UPDATE users AS u
SET clerk_user_id = c.clerk_user_id
FROM candidates AS c
JOIN unique_links AS l USING (clerk_user_id)
WHERE u.id = c.user_id;
