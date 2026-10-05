// The admin dashboard (/api/admin/*). Admins are separate accounts from users.
import type { UsageWindow } from "./extension.js";
import type { Plan, PlanModel, PlanPricing, PlanWindow, Provider } from "./plans.js";
import type { UsageTotals } from "./usage.js";
import type { SignedInWith } from "./users.js";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

// GET /api/admin/auth/setup: true only while no admin exists yet.
export interface AdminSetupStatus {
  setupNeeded: boolean;
}

// Creating an admin: the first one (signup page) or by another admin.
export interface NewAdminRequest {
  name: string;
  email: string;
  password: string;
}

export interface ChangeAdminPasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface AdminAccount extends AdminProfile {
  createdAt: string;
  lastLoginAt: string | null;
}

export interface AdminAuthResponse {
  admin: AdminProfile;
  token: string;
  expiresAt: string;
}

// A provider's key as the admin page sees it: never the key itself.
export interface ProviderKeyStatus {
  provider: Provider;
  configured: boolean;
  // "db" when set from the admin page, "env" when only the server's .env has one.
  source: "db" | "env" | null;
  last4: string | null;
  updatedAt: string | null;
  updatedBy: string | null;
  lastCheckedAt: string | null;
  lastCheckOk: boolean | null;
  lastCheckError: string | null;
}

export interface SetProviderKeyRequest {
  key: string;
}

export interface AdminPlan extends Plan {
  models: PlanModel[];
  // Users currently on this plan.
  subscribers: number;
}

export interface UpdatePlanRequest {
  name: string;
  windows: PlanWindow[];
  pricing?: PlanPricing | null;
}

export interface SetPlanModelsRequest {
  models: PlanModel[];
}

export interface AdminUserRow {
  id: string;
  email: string;
  name: string;
  username: string;
  signedInWith: SignedInWith;
  planId: string;
  planName: string;
  planEndsAt: string | null;
  createdAt: string;
  lastActiveAt: string | null;
}

export interface AdminUserList {
  items: AdminUserRow[];
  total: number;
  page: number;
  pageSize: number;
}

// Usage with what it cost us, in micro-dollars. Admin-only: users see percentages.
export interface CostedTotals extends UsageTotals {
  costMicros: number;
}

export interface CostedDay extends CostedTotals {
  date: string;
}

export interface CostedModel extends CostedTotals {
  modelId: string;
  provider: Provider;
}

// A window's spend in micro-dollars, next to the percentage the user sees.
export interface WindowSpend extends UsageWindow {
  spentMicros: number;
  limitMicros: number;
}

export interface AdminUserDetail extends AdminUserRow {
  windows: WindowSpend[];
  last30Days: CostedTotals;
  daily: CostedDay[];
  byModel: CostedModel[];
}

export interface AssignPlanRequest {
  planId: string;
  // ISO date; the user returns to Free after it. Null or missing: no end date.
  endsAt?: string | null;
}

export interface TopUser extends CostedTotals {
  userId: string;
  email: string;
}

export interface AdminUsageReport {
  from: string;
  to: string;
  totals: CostedTotals;
  daily: CostedDay[];
  byModel: CostedModel[];
  byProvider: ({ provider: Provider } & CostedTotals)[];
  topUsers: TopUser[];
}

export interface AuditEntry {
  id: string;
  adminName: string | null;
  action: string;
  target: string | null;
  details: Record<string, unknown>;
  createdAt: string;
}

export interface AdminOverview {
  users: { total: number; paid: number; newLast7Days: number };
  today: CostedTotals;
  last7Days: CostedDay[];
  providers: ProviderKeyStatus[];
  topUsers: TopUser[];
  recentActivity: AuditEntry[];
}
