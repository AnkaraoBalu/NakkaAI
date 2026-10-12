import { describe, expect, it } from "vitest";
import { allowedBetas, guardBody } from "./request-guard.js";

describe("request guard", () => {
  it("keeps only betas that don't change the price", () => {
    expect(allowedBetas("prompt-caching-2024-07-31, context-1m-2025-08-07", [])).toBe(
      "prompt-caching-2024-07-31",
    );
    expect(allowedBetas("context-1m-2025-08-07", [])).toBeUndefined();
    expect(allowedBetas("context-1m-2025-08-07", ["context-1m-2025-08-07"])).toBe("context-1m-2025-08-07");
    expect(allowedBetas(undefined, [])).toBeUndefined();
  });

  it("refuses Anthropic server tools and MCP, allows client tools", () => {
    expect(guardBody(true, { tools: [{ type: "web_search_20250305", name: "web_search" }] }).ok).toBe(false);
    expect(guardBody(true, { mcp_servers: [] }).ok).toBe(false);
    const own = guardBody(true, { tools: [{ name: "read_file", input_schema: {} }, { type: "custom", name: "x" }] });
    expect(own).toEqual({ ok: true, body: expect.any(Object), changed: false });
  });

  it("strips separately billed OpenAI-style options", () => {
    const result = guardBody(false, { model: "m", service_tier: "priority", web_search_options: {}, search_parameters: {} });
    expect(result).toEqual({ ok: true, body: { model: "m" }, changed: true });
    expect(guardBody(false, { model: "m" })).toEqual({ ok: true, body: { model: "m" }, changed: false });
  });
});
