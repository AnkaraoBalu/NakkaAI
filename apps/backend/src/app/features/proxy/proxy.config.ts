import { registerAs } from "@nestjs/config";

export interface ProxyConfig {
  // Billing page shown with 402s and in GET /account, once one exists.
  manageUrl?: string;
}

export const proxyConfig = registerAs("proxy", (): ProxyConfig => ({
  manageUrl: process.env.MANAGE_URL || undefined,
}));
