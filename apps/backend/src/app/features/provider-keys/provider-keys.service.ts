import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
  type OnApplicationBootstrap,
} from "@nestjs/common";
import type { ProviderKeyStatus } from "@nakka/types/admin";
import { decryptSecret, encryptSecret } from "../../common/crypto/secret-box.js";
import {
  PROVIDERS,
  providerKeysConfig,
  type Provider,
  type ProviderKeysConfig,
} from "./provider-keys.config.js";
import { ProviderKeysRepository, type ProviderKeyRow } from "./provider-keys.repository.js";

// A changed key reaches the proxy within this long (immediately on this server).
const CACHE_MS = 60 * 1000;
const TEST_TIMEOUT_MS = 10 * 1000;

const NO_SECRET =
  "PROVIDER_KEYS_SECRET isn't set on the server, so keys can't be saved or read.";

// Our API key for each AI company: saved encrypted from the admin page, with
// the server's .env as a fallback. The plain key never leaves the server.
@Injectable()
export class ProviderKeysService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ProviderKeysService.name);
  private readonly cache = new Map<Provider, { key: string | null; at: number }>();

  constructor(
    private readonly keys: ProviderKeysRepository,
    @Inject(providerKeysConfig.KEY) private readonly config: ProviderKeysConfig,
  ) {}

  async onApplicationBootstrap() {
    if (this.config.secret) return;
    try {
      if ((await this.keys.list()).length) this.logger.error(NO_SECRET);
    } catch {
      // Database not reachable; DatabaseModule already reports it.
    }
  }

  url(provider: Provider): string {
    return this.config.urls[provider];
  }

  // The key the proxy should use, or null if there is none.
  async get(provider: Provider): Promise<string | null> {
    const cached = this.cache.get(provider);
    if (cached && Date.now() - cached.at < CACHE_MS) return cached.key;
    const key = (await this.saved(provider)) ?? this.config.envKeys[provider] ?? null;
    this.cache.set(provider, { key, at: Date.now() });
    return key;
  }

  async list(): Promise<ProviderKeyStatus[]> {
    const rows = new Map((await this.keys.list()).map((row) => [row.provider, row]));
    return PROVIDERS.map((provider) => this.status(provider, rows.get(provider)));
  }

  async set(provider: Provider, key: string, adminId: string): Promise<ProviderKeyStatus> {
    const secret = this.requireSecret();
    await this.keys.save(provider, encryptSecret(key, secret), key.slice(-4), adminId);
    this.cache.delete(provider);
    return this.find(provider);
  }

  async remove(provider: Provider): Promise<void> {
    if (!(await this.keys.remove(provider))) {
      throw new NotFoundException("No key is saved for this provider.");
    }
    this.cache.delete(provider);
  }

  // Asks the provider to list its models: cheap, and fails only on a bad key.
  async test(provider: Provider): Promise<ProviderKeyStatus> {
    const saved = await this.saved(provider);
    const key = saved ?? this.config.envKeys[provider];
    if (!key) throw new NotFoundException("No key is set for this provider.");

    let ok = false;
    let error: string | null = null;
    try {
      const response = await fetch(this.modelsUrl(provider), {
        headers:
          provider === "anthropic"
            ? { "x-api-key": key, "anthropic-version": "2023-06-01" }
            : { authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(TEST_TIMEOUT_MS),
      });
      ok = response.ok;
      if (!ok) error = `${response.status}: ${(await response.text()).slice(0, 300)}`;
    } catch (err) {
      error = (err as Error).name === "TimeoutError"
        ? "The provider didn't answer within 10 seconds."
        : `Couldn't reach the provider: ${(err as Error).message}`;
    }
    // Never echo the key back, even if the provider quotes it.
    if (error) error = error.split(key).join("••••");

    if (saved) {
      await this.keys.saveCheck(provider, ok, error);
      return this.find(provider);
    }
    return {
      ...this.status(provider, undefined),
      lastCheckedAt: new Date().toISOString(),
      lastCheckOk: ok,
      lastCheckError: error,
    };
  }

  // Chat URL → the same API's model list (…/messages or …/chat/completions → …/models).
  private modelsUrl(provider: Provider): string {
    return this.config.urls[provider].replace(/\/(messages|chat\/completions)$/, "/models");
  }

  private async saved(provider: Provider): Promise<string | null> {
    const box = await this.keys.encryptedKey(provider);
    if (!box) return null;
    try {
      return decryptSecret(box, this.requireSecret());
    } catch (error) {
      this.logger.error(`Can't decrypt the ${provider} key: ${(error as Error).message}`);
      return null;
    }
  }

  private async find(provider: Provider): Promise<ProviderKeyStatus> {
    return (await this.list()).find((status) => status.provider === provider)!;
  }

  private status(provider: Provider, row: ProviderKeyRow | undefined): ProviderKeyStatus {
    if (row) {
      return {
        provider,
        configured: true,
        source: "db",
        last4: row.last4,
        updatedAt: row.updatedAt.toISOString(),
        updatedBy: row.updatedBy,
        lastCheckedAt: row.lastCheckedAt?.toISOString() ?? null,
        lastCheckOk: row.lastCheckOk,
        lastCheckError: row.lastCheckError,
      };
    }
    const envKey = this.config.envKeys[provider];
    return {
      provider,
      configured: Boolean(envKey),
      source: envKey ? "env" : null,
      last4: envKey ? envKey.slice(-4) : null,
      updatedAt: null,
      updatedBy: null,
      lastCheckedAt: null,
      lastCheckOk: null,
      lastCheckError: null,
    };
  }

  private requireSecret(): string {
    if (!this.config.secret) throw new ServiceUnavailableException(NO_SECRET);
    return this.config.secret;
  }
}
