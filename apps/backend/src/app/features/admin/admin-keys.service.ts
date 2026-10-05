import { Injectable } from "@nestjs/common";
import type { ProviderKeyStatus } from "@nakka/types/admin";
import type { Provider } from "../provider-keys/provider-keys.config.js";
import { ProviderKeysService } from "../provider-keys/provider-keys.service.js";
import { AuditLogRepository } from "./audit-log.repository.js";

// The admin page's view of our provider keys, with every change audited.
@Injectable()
export class AdminKeysService {
  constructor(
    private readonly keys: ProviderKeysService,
    private readonly audit: AuditLogRepository,
  ) {}

  list(): Promise<ProviderKeyStatus[]> {
    return this.keys.list();
  }

  async set(provider: Provider, key: string, adminId: string): Promise<ProviderKeyStatus> {
    const status = await this.keys.set(provider, key, adminId);
    await this.audit.record(adminId, "provider_key.set", provider, { last4: status.last4 });
    return status;
  }

  async remove(provider: Provider, adminId: string): Promise<void> {
    await this.keys.remove(provider);
    await this.audit.record(adminId, "provider_key.remove", provider);
  }

  async test(provider: Provider, adminId: string): Promise<ProviderKeyStatus> {
    const status = await this.keys.test(provider);
    await this.audit.record(adminId, "provider_key.test", provider, {
      ok: status.lastCheckOk,
    });
    return status;
  }
}
