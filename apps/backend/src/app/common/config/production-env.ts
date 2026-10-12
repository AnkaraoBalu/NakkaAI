// In production, a missing setting must stop the server at startup instead of
// letting it run half-broken (website calls to localhost, keys unreadable,
// no email). Development keeps working with defaults.
const REQUIRED_IN_PRODUCTION = [
  "CORS_ORIGINS",
  "FRONTEND_URL",
  "PGHOST",
  "PGDATABASE",
  "PGUSER",
  "PGPASSWORD",
  "PROVIDER_KEYS_SECRET",
  "SMTP_HOST",
];

// Worth a warning, but the server works without them.
const RECOMMENDED_IN_PRODUCTION = ["CLERK_SECRET_KEY", "TRUST_PROXY", "MANAGE_URL"];

export function checkProductionEnv(env: NodeJS.ProcessEnv = process.env) {
  const missing: string[] = [];
  const warnings: string[] = [];
  if (env.NODE_ENV !== "production") return { missing, warnings };

  const value = (name: string) => env[name]?.trim() ?? "";
  for (const name of REQUIRED_IN_PRODUCTION) if (!value(name)) missing.push(name);
  const secret = value("PROVIDER_KEYS_SECRET");
  if (secret && secret.length < 32) missing.push("PROVIDER_KEYS_SECRET (at least 32 characters)");

  for (const name of RECOMMENDED_IN_PRODUCTION) {
    if (!value(name)) warnings.push(`${name} is not set`);
  }
  for (const name of ["CORS_ORIGINS", "FRONTEND_URL"]) {
    if (/localhost|127\.0\.0\.1/.test(value(name))) warnings.push(`${name} points at localhost`);
  }
  return { missing, warnings };
}
