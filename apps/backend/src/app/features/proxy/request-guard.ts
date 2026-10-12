// What a client may ask the provider for. Allowances are priced per token, so
// anything the provider bills differently (server-side tools billed per use,
// priority tiers, 1M-context pricing, live search) must not get through
// unpriced. Everything else in the body is forwarded as sent.

// Anthropic betas that don't change what a request costs. Others (e.g. the 1M
// context window, billed at a higher rate) are dropped. Extend with
// ANTHROPIC_BETA_ALLOWLIST (comma-separated) once priced.
const SAFE_ANTHROPIC_BETAS = [
  "prompt-caching-2024-07-31",
  "interleaved-thinking-2025-05-14",
  "fine-grained-tool-streaming-2025-05-14",
  "token-efficient-tools-2025-02-19",
];

// OpenAI-style fields that turn on separately billed features.
const STRIPPED_OPENAI_FIELDS = ["service_tier", "web_search_options", "search_parameters"];

export type GuardResult =
  | { ok: true; body: Record<string, unknown>; changed: boolean }
  | { ok: false; message: string };

export function allowedBetas(header: string | string[] | undefined, extra: string[]): string | undefined {
  if (!header) return undefined;
  const allowed = new Set([...SAFE_ANTHROPIC_BETAS, ...extra]);
  const kept = String(header)
    .split(",")
    .map((beta) => beta.trim())
    .filter((beta) => allowed.has(beta));
  return kept.length ? kept.join(",") : undefined;
}

export function guardBody(anthropic: boolean, body: Record<string, unknown>): GuardResult {
  if (anthropic) {
    // Server tools (web search, code execution, ...) have a `type` other than
    // "custom" and are billed per use; MCP servers and containers likewise.
    const tools = Array.isArray(body.tools) ? (body.tools as { type?: unknown }[]) : [];
    const serverTool = tools.some(
      (tool) => tool && typeof tool === "object" && tool.type !== undefined && tool.type !== "custom",
    );
    if (serverTool || "mcp_servers" in body || "container" in body) {
      return {
        ok: false,
        message: "Server-side tools (web search, code execution, MCP) aren't available. Use your own tools instead.",
      };
    }
    return { ok: true, body, changed: false };
  }
  const present = STRIPPED_OPENAI_FIELDS.filter((field) => field in body);
  if (!present.length) return { ok: true, body, changed: false };
  const copy = { ...body };
  for (const field of present) delete copy[field];
  return { ok: true, body: copy, changed: true };
}
