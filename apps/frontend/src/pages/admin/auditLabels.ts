import type { AuditEntry } from "@nakka/types/admin";
import type { Provider } from "@nakka/types/plans";
import { PROVIDER_INFO } from "../../constants/providers";

const providerName = (target: string | null) =>
  (target && PROVIDER_INFO[target as Provider]?.name) ?? target ?? "";

// One line describing an admin action, for the activity list.
export function describeAudit(entry: AuditEntry): { icon: string; text: string } {
  const details = entry.details as Record<string, unknown>;
  switch (entry.action) {
    case "admin.login":
      return { icon: "login", text: "signed in" };
    case "admin.setup":
      return { icon: "person_add", text: "created the first admin account" };
    case "admin.create":
      return { icon: "person_add", text: `added admin ${String(details.email ?? "")}` };
    case "admin.password":
      return { icon: "password", text: "changed their password" };
    case "provider_key.set":
      return { icon: "key", text: `set the ${providerName(entry.target)} key (…${String(details.last4 ?? "")})` };
    case "provider_key.remove":
      return { icon: "key_off", text: `removed the ${providerName(entry.target)} key` };
    case "provider_key.test":
      return {
        icon: details.ok ? "check_circle" : "error",
        text: `tested the ${providerName(entry.target)} key: ${details.ok ? "working" : "failed"}`,
      };
    case "plan.update":
      return { icon: "tune", text: `changed the ${entry.target} plan's allowances` };
    case "plan.models":
      return { icon: "model_training", text: `changed the ${entry.target} plan's models` };
    case "subscription.assign":
      return {
        icon: "workspace_premium",
        text: `moved ${String(details.email ?? "a user")} from ${String(details.from)} to ${String(details.to)}`,
      };
    default:
      return { icon: "history", text: entry.action };
  }
}
