import { registerAs } from "@nestjs/config";

export type Provider = "anthropic" | "openai" | "google" | "xai";

export interface ProxyConfig {
  // Our keys for each AI company. Never stored in the database.
  keys: Partial<Record<Provider, string>>;
  // Where each company's API lives (overridable, e.g. for tests).
  urls: Record<Provider, string>;
  // Billing page shown with 402s and in GET /account, once one exists.
  manageUrl?: string;
}

export const proxyConfig = registerAs("proxy", (): ProxyConfig => ({
  keys: {
    anthropic: process.env.ANTHROPIC_API_KEY || undefined,
    openai: process.env.OPENAI_API_KEY || undefined,
    google: process.env.GEMINI_API_KEY || undefined,
    xai: process.env.XAI_API_KEY || undefined,
  },
  urls: {
    anthropic:
      process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com/v1/messages",
    openai:
      process.env.OPENAI_BASE_URL ??
      "https://api.openai.com/v1/chat/completions",
    google:
      process.env.GEMINI_BASE_URL ??
      "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    xai: process.env.XAI_BASE_URL ?? "https://api.x.ai/v1/chat/completions",
  },
  manageUrl: process.env.MANAGE_URL || undefined,
}));
