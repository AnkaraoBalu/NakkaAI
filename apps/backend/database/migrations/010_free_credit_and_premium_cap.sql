-- Plans built like Claude Code's:
--  * A window with "duration_hours": null in plans.windows never resets: the
--    Free plan's one-time credit. Its usage_windows row gets resets_at = 'infinity'.
--  * A window with "premium_only": true counts only premium models, like
--    Claude's separate weekly Opus limit.
--  * plans.pricing keeps the inputs the admin used to work out the budgets
--    (monthly price, margin, exchange rate, sessions per week, premium share).

ALTER TABLE plan_models ADD COLUMN premium boolean NOT NULL DEFAULT false;

ALTER TABLE plans ADD COLUMN pricing jsonb;
