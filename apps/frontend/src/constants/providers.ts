import type { Provider } from "@nakka/types/plans";

// The AI companies Nakka forwards requests to, in display order.
export const PROVIDERS: Provider[] = ["anthropic", "openai", "google", "xai"];

export const PROVIDER_INFO: Record<
  Provider,
  { name: string; color: string; keysUrl: string; keyHint: string }
> = {
  anthropic: {
    name: "Anthropic",
    color: "#c96442",
    keysUrl: "https://console.anthropic.com/settings/keys",
    keyHint: "sk-ant-…",
  },
  openai: {
    name: "OpenAI",
    color: "#10a37f",
    keysUrl: "https://platform.openai.com/api-keys",
    keyHint: "sk-…",
  },
  google: {
    name: "Google Gemini",
    color: "#4285f4",
    keysUrl: "https://aistudio.google.com/apikey",
    keyHint: "AIza…",
  },
  xai: {
    name: "xAI",
    color: "#171b26",
    keysUrl: "https://console.x.ai",
    keyHint: "xai-…",
  },
};
