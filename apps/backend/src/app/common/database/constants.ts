// Injection token for the Postgres connection pool.
export const DATABASE = Symbol("DATABASE");

export const TABLES = {
  USERS: "users",
  EMAIL_VERIFICATIONS: "email_verifications",
  USER_IDENTITIES: "user_identities",
  AUTH_STATES: "auth_states",
  AUTH_TOKENS: "auth_tokens",
  PLANS: "plans",
  PLAN_MODELS: "plan_models",
  SUBSCRIPTIONS: "subscriptions",
  USAGE_EVENTS: "usage_events",
  USAGE_WINDOWS: "usage_windows",
  ADMIN_USERS: "admin_users",
  ADMIN_TOKENS: "admin_tokens",
  PROVIDER_KEYS: "provider_keys",
  ADMIN_AUDIT_LOG: "admin_audit_log",
} as const;
