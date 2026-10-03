import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ExtensionAccount, ModelList } from "@nakka/types/extension";
import { UsersRepository } from "../auth/users.repository.js";
import { proxyConfig, type ProxyConfig } from "../proxy/proxy.config.js";
import { PlansRepository } from "./plans.repository.js";

const HOUR = 60 * 60 * 1000;

// What the extension shows in its Account panel and model picker.
@Injectable()
export class ExtensionApiService {
  constructor(
    private readonly users: UsersRepository,
    private readonly plans: PlansRepository,
    @Inject(proxyConfig.KEY) private readonly proxy: ProxyConfig,
  ) {}

  async account(userId: string): Promise<ExtensionAccount> {
    const user = await this.users.findById(userId);
    if (!user) throw new UnauthorizedException();
    const plan = await this.plans.planFor(userId);

    const account: ExtensionAccount = {
      email: user.email,
      plan: plan.id,
      signedInWith: user.signedInWith,
      ...(user.workspace ? { workspace: user.workspace } : {}),
      ...(this.proxy.manageUrl ? { manageUrl: this.proxy.manageUrl } : {}),
    };
    // No windows on the plan: the extension shows no usage meters.
    if (plan.windows.length) {
      const usage = await this.plans.usage(userId);
      account.windows = plan.windows.map((window) => {
        const current = usage.get(window.id);
        return {
          id: window.id,
          label: window.label,
          used: current?.used ?? 0,
          limit: window.limit,
          // A window that hasn't started yet would reset this long after first use.
          resetsAt: (
            current?.resetsAt ??
            new Date(Date.now() + window.duration_hours * HOUR)
          ).toISOString(),
        };
      });
    }
    return account;
  }

  async models(userId: string): Promise<ModelList> {
    const plan = await this.plans.planFor(userId);
    const models = await this.plans.models(plan.id);
    return { data: models.map((model) => ({ id: model.modelId })) };
  }
}
