import { registerAs } from "@nestjs/config";

const configuredConcurrency = Number(process.env.PROXY_MAX_CONCURRENT_PER_USER ?? 4);

export interface ProxyConfig {
  // Billing page shown with 402s and in GET /account, once one exists.
  manageUrl?: string;
  // AI requests one user may run at once (1 while on a one-time credit).
  maxConcurrentPerUser: number;
  // Extra Anthropic betas to forward, beyond the price-neutral built-in list.
  extraAnthropicBetas: string[];
}

export const proxyConfig = registerAs("proxy", (): ProxyConfig => ({
  manageUrl: process.env.MANAGE_URL || undefined,
  maxConcurrentPerUser:
    Number.isSafeInteger(configuredConcurrency) && configuredConcurrency > 0
      ? configuredConcurrency
      : 4,
  extraAnthropicBetas: (process.env.ANTHROPIC_BETA_ALLOWLIST ?? "")
    .split(",")
    .map((beta) => beta.trim())
    .filter(Boolean),
}));
