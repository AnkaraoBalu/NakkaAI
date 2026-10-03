-- Google/GitHub sign-in goes through Clerk. Those users may never set a password.
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN clerk_user_id text;
CREATE UNIQUE INDEX users_clerk_user_id_key ON users (clerk_user_id);
