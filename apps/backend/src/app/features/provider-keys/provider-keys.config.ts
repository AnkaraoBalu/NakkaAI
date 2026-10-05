import { registerAs } from "@nestjs/config";
import type { Provider } from "@nakka/types/plans";

export type { Provider };

export const PROVIDERS: readonly Provider[] = ["anthropic", "openai", "google", "xai"];

export interface ProviderKeysConfig {
  // Encrypts the keys saved from the admin page. Without it, keys can't be saved.
  secret?: string;
  // Keys from .env, used only for a provider with no key saved from the admin page.
  envKeys: Partial<Record<Provider, string>>;
  // Where each company's chat API lives (overridable, e.g. for tests).
  urls: Record<Provider, string>;
}

export const providerKeysConfig = registerAs(
  "providerKeys",
  (): ProviderKeysConfig => ({
    secret: process.env.PROVIDER_KEYS_SECRET || undefined,
    envKeys: {
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
  }),
);
