import { registerAs } from "@nestjs/config";

export interface AdminConfig {
  sessionTtlMs: number;
  // Failed sign-ins allowed per email and address before a pause.
  maxLoginAttempts: number;
  loginLockMs: number;
}

const MINUTE = 60 * 1000;

export const adminConfig = registerAs("admin", (): AdminConfig => ({
  sessionTtlMs: Number(process.env.ADMIN_SESSION_TTL_HOURS ?? 12) * 60 * MINUTE,
  maxLoginAttempts: 5,
  loginLockMs: 15 * MINUTE,
}));
