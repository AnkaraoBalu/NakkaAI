import { EventEmitter } from "node:events";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProxyService } from "./proxy.service.js";
import type { ProxyRepository } from "./proxy.repository.js";
import type { UsageRepository } from "./usage.repository.js";
import type { ProviderKeysService } from "../provider-keys/provider-keys.service.js";
import type { Request, Response } from "express";

function setup() {
  const windows = [{ id: "credit", label: "Free credit", limit: 100000, duration_hours: null }];
  const access = { access: vi.fn(async () => ({
    userId: "user-1", tokenId: "token-1", touch: false,
    plan: { id: "free", name: "Free", windows }, usage: [],
    model: { modelId: "gpt-5.4", upstreamModel: "gpt-5.4", provider: "fuelix",
      inputPrice: 1, outputPrice: 1, cacheReadPrice: null, cacheWritePrice: null, premium: false },
  })) };
  const usage = { record: vi.fn(async () => {}) };
  const keys = { get: vi.fn(async () => "fuelix-test-key"), url: vi.fn(() => "https://api.fuelix.ai/v1/chat/completions") };
  const service = new ProxyService(access as unknown as ProxyRepository,
    usage as unknown as UsageRepository, keys as unknown as ProviderKeysService, {});
  const payload = { model: "gpt-5.4", messages: [{ role: "user", content: "echo" }],
    tools: [{ type: "function", function: { name: "echo", parameters: { type: "object" } } }] };
  const rawBody = Buffer.from(JSON.stringify(payload));
  const req = { headers: { authorization: "Bearer test-session" }, body: payload, rawBody } as unknown as Request;
  const res = Object.assign(new EventEmitter(), {
    writableFinished: false, writableEnded: false,
    status: vi.fn(), json: vi.fn(), setHeader: vi.fn(), flushHeaders: vi.fn(),
    write: vi.fn((_chunk: Uint8Array) => true), end: vi.fn(),
  });
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.end.mockImplementation(() => { res.writableEnded = true; });
  return { service, keys, usage, req, res, rawBody, windows };
}

afterEach(() => vi.unstubAllGlobals());

describe("Fuelix proxy", () => {
  it("forwards tools unchanged with the Fuelix key and records provider usage", async () => {
    const reply = JSON.stringify({ choices: [{ message: { role: "assistant", tool_calls: [{
      id: "call-1", type: "function", function: { name: "echo", arguments: "{}" },
    }] } }], usage: { prompt_tokens: 2, completion_tokens: 3 } });
    const fetch = vi.fn(async () => new globalThis.Response(reply, {
      status: 200, headers: { "content-type": "application/json" },
    }));
    vi.stubGlobal("fetch", fetch);
    const { service, keys, usage, req, res, rawBody, windows } = setup();
    await service.handle(req, res as unknown as Response, "chat");
    expect(keys.get).toHaveBeenCalledWith("fuelix");
    expect(fetch).toHaveBeenCalledWith("https://api.fuelix.ai/v1/chat/completions", expect.objectContaining({
      headers: { "content-type": "application/json", authorization: "Bearer fuelix-test-key" }, body: rawBody,
    }));
    expect(Buffer.concat(res.write.mock.calls.map(([chunk]) => Buffer.from(chunk))).toString()).toBe(reply);
    expect(usage.record).toHaveBeenCalledWith(expect.objectContaining({
      userId: "user-1", modelId: "gpt-5.4", provider: "fuelix", inputTokens: 2, outputTokens: 3, costMicros: 5,
    }), windows);
    expect(res.end).toHaveBeenCalled();
  });

  it("rejects the Anthropic Messages route for the Fuelix OpenAI protocol", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { service, req, res, usage } = setup();
    await service.handle(req, res as unknown as Response, "messages");
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetch).not.toHaveBeenCalled();
    expect(usage.record).not.toHaveBeenCalled();
  });
});
