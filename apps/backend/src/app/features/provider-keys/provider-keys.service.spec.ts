import { afterEach, describe, expect, it, vi } from "vitest";
import { encryptSecret } from "../../common/crypto/secret-box.js";
import { ProviderKeysService } from "./provider-keys.service.js";
import type { ProviderKeysRepository } from "./provider-keys.repository.js";
import type { ProviderKeysConfig } from "./provider-keys.config.js";

const SECRET = "test-secret";
const urls = {
  anthropic: "https://anthropic.test/v1/messages",
  openai: "https://openai.test/v1/chat/completions",
  google: "https://google.test/v1beta/openai/chat/completions",
  xai: "https://xai.test/v1/chat/completions",
  fuelix: "https://api.fuelix.ai/v1/chat/completions",
};

function setup({
  saved = {} as Record<string, string>,
  envKeys = {} as ProviderKeysConfig["envKeys"],
  secret = SECRET as string | undefined,
} = {}) {
  const boxes = new Map(
    Object.entries(saved).map(([provider, key]) => [provider, encryptSecret(key, SECRET)]),
  );
  const last4 = new Map(Object.entries(saved).map(([provider, key]) => [provider, key.slice(-4)]));
  const repository = {
    encryptedKey: vi.fn(async (provider: string) => boxes.get(provider) ?? null),
    list: vi.fn(async () =>
      [...boxes.keys()].map((provider) => ({
        provider, encryptedKey: boxes.get(provider)!, last4: last4.get(provider)!,
        updatedAt: new Date(), updatedBy: "Admin", lastCheckedAt: null, lastCheckOk: null, lastCheckError: null,
      })),
    ),
    save: vi.fn(async (provider: string, box: string, four: string) => {
      boxes.set(provider, box);
      last4.set(provider, four);
    }),
    remove: vi.fn(async (provider: string) => boxes.delete(provider)),
    saveCheck: vi.fn(async () => {}),
  };
  const service = new ProviderKeysService(
    repository as unknown as ProviderKeysRepository,
    { secret, envKeys, urls },
  );
  return { service, repository };
}

afterEach(() => vi.unstubAllGlobals());

describe("provider keys", () => {
  it("saves Fuelix separately and tests it using the OpenAI-compatible API", async () => {
    const fetch = vi.fn(async () => new Response('{"data":[]}', { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    const { service, repository } = setup();
    const status = await service.set("fuelix", "fuelix-test-key-1234", "admin-1");
    expect(status).toMatchObject({ provider: "fuelix", configured: true, last4: "1234" });
    expect(await service.get("fuelix")).toBe("fuelix-test-key-1234");
    expect(await service.get("openai")).toBeNull();
    expect(service.url("fuelix")).toBe("https://api.fuelix.ai/v1/chat/completions");
    expect(JSON.stringify(await service.list())).not.toContain("fuelix-test-key-1234");
    expect(repository.save.mock.calls[0][1]).not.toContain("fuelix-test-key-1234");
    await service.test("fuelix");
    expect(fetch).toHaveBeenCalledWith("https://api.fuelix.ai/v1/models", expect.objectContaining({
      headers: { authorization: "Bearer fuelix-test-key-1234" },
    }));
  });

  it("prefers the saved key over .env, and falls back to .env", async () => {
    const { service } = setup({ saved: { openai: "sk-saved-1111" }, envKeys: { openai: "sk-env", xai: "xai-env" } });
    expect(await service.get("openai")).toBe("sk-saved-1111");
    expect(await service.get("xai")).toBe("xai-env");
    expect(await service.get("google")).toBeNull();
  });

  it("caches lookups and clears the cache when a key changes", async () => {
    const { service, repository } = setup({ saved: { openai: "sk-old-0000" } });
    await service.get("openai");
    await service.get("openai");
    expect(repository.encryptedKey).toHaveBeenCalledTimes(1);
    await service.set("openai", "sk-new-9999", "admin-1");
    expect(await service.get("openai")).toBe("sk-new-9999");
  });

  it("never returns the key in a status, only its last 4", async () => {
    const { service } = setup({ envKeys: { anthropic: "sk-ant-env-5678" } });
    const status = await service.set("openai", "sk-live-abcd1234", "admin-1");
    expect(JSON.stringify(await service.list())).not.toContain("sk-");
    expect(status).toMatchObject({ provider: "openai", configured: true, source: "db", last4: "1234" });
    expect((await service.list()).find((s) => s.provider === "anthropic")).toMatchObject({
      configured: true, source: "env", last4: "5678",
    });
  });

  it("refuses to save without a master secret", async () => {
    const { service } = setup({ secret: "" });
    await expect(service.set("openai", "sk-live-1234", "a")).rejects.toThrow(/PROVIDER_KEYS_SECRET/);
  });

  it("tests a key against the provider's model list and scrubs the key from errors", async () => {
    const fetch = vi.fn(async () => new Response("bad key sk-live-abcd1234", { status: 401 }));
    vi.stubGlobal("fetch", fetch);
    const { service, repository } = setup({ saved: { openai: "sk-live-abcd1234" } });
    await service.test("openai");
    expect(fetch).toHaveBeenCalledWith("https://openai.test/v1/models", expect.anything());
    const [, ok, error] = repository.saveCheck.mock.calls[0] as unknown as [string, boolean, string];
    expect(ok).toBe(false);
    expect(error).toContain("401");
    expect(error).not.toContain("sk-live");
  });

  it("uses Anthropic's own headers for the test", async () => {
    const fetch = vi.fn(async () => new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetch);
    const { service } = setup({ saved: { anthropic: "sk-ant-1234" } });
    await service.test("anthropic");
    expect(fetch).toHaveBeenCalledWith(
      "https://anthropic.test/v1/models",
      expect.objectContaining({ headers: { "x-api-key": "sk-ant-1234", "anthropic-version": "2023-06-01" } }),
    );
  });
});
