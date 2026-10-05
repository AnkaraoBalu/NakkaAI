-- Allowances measure what requests cost, like Claude Code's limits, instead of
-- counting requests: a long Opus call uses far more than a short mini-model one.

-- What each model costs us, in US dollars per million tokens. A model whose
-- input or output price is 0 can't be used until an admin sets its prices.
-- Cache prices left NULL are charged at the input price.
ALTER TABLE plan_models
  ADD COLUMN input_price       numeric(12, 4) NOT NULL DEFAULT 0,
  ADD COLUMN output_price      numeric(12, 4) NOT NULL DEFAULT 0,
  ADD COLUMN cache_read_price  numeric(12, 4),
  ADD COLUMN cache_write_price numeric(12, 4);

-- input_tokens is now uncached input for every provider; cache writes are
-- counted separately, and cost is what the request cost us, in micro-dollars.
ALTER TABLE usage_events
  ADD COLUMN cache_write_tokens int    NOT NULL DEFAULT 0,
  ADD COLUMN cost_micros        bigint NOT NULL DEFAULT 0;

-- Windows now add up cost in micro-dollars (plans.windows[].limit too).
-- Old request counts and limits don't convert, so they start over.
ALTER TABLE usage_windows ALTER COLUMN used TYPE bigint;
DELETE FROM usage_windows;
UPDATE plans SET windows = '[]';
