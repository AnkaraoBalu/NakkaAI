import { registerAs } from "@nestjs/config";

export interface AuthConfig {
  sessionTtlMs: number;
  otpTtlMs: number;
  otpResendCooldownMs: number;
  otpMaxAttempts: number;
  // How long after verifying the code the user has to finish creating the account.
  verificationTokenTtlMs: number;
  // Google/GitHub sign-in through Clerk; disabled when the key is missing.
  clerkSecretKey?: string;
  // Frontend origins allowed to have issued the Clerk token.
  clerkAuthorizedParties: string[];
  // VS Code extension sign-in.
  extensionTokenTtlMs: number;
  authStateTtlMs: number;
  // The only place the /auth handoff may send a token.
  extensionRedirectPrefix: string;
  // The website, for redirecting GET /auth to its sign-in page.
  frontendUrl: string;
}

const MINUTE = 60 * 1000;

export const authConfig = registerAs("auth", (): AuthConfig => ({
  sessionTtlMs: Number(process.env.SESSION_TTL_HOURS ?? 168) * 60 * MINUTE,
  otpTtlMs: 10 * MINUTE,
  otpResendCooldownMs: 60 * 1000,
  otpMaxAttempts: 5,
  verificationTokenTtlMs: 30 * MINUTE,
  clerkSecretKey: process.env.CLERK_SECRET_KEY || undefined,
  clerkAuthorizedParties: (process.env.CORS_ORIGINS ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  extensionTokenTtlMs:
    Number(process.env.EXTENSION_TOKEN_TTL_DAYS ?? 90) * 24 * 60 * MINUTE,
  authStateTtlMs: 10 * MINUTE,
  extensionRedirectPrefix: "vscode://Nakka.nakka/",
  frontendUrl: (process.env.FRONTEND_URL ?? "http://localhost:3000").replace(
    /\/+$/,
    "",
  ),
}));
