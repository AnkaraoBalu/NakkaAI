ALTER TABLE users
  ADD COLUMN is_verified  boolean NOT NULL DEFAULT false,
  ADD COLUMN is_logged_in boolean NOT NULL DEFAULT false;
