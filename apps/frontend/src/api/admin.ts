import type {
  AdminAccount,
  AdminAuthResponse,
  AdminLoginRequest,
  AdminOverview,
  AdminPlan,
  AdminProfile,
  AdminUsageReport,
  AdminUserDetail,
  AdminUserList,
  AdminSetupStatus,
  AssignPlanRequest,
  ChangeAdminPasswordRequest,
  NewAdminRequest,
  ProviderKeyStatus,
  UpdatePlanRequest,
} from "@nakka/types/admin";
import type { PlanModel, Provider } from "@nakka/types/plans";
import { ApiError, request } from "./http";
import { ADMIN_SIGNED_OUT_EVENT, adminTokenStore } from "./adminSession";

// Calls an admin endpoint with the admin token. A 401 means the session ended:
// the token is dropped and the admin pages go back to the sign-in screen.
async function adminRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = adminTokenStore.get();
  if (!token) {
    window.dispatchEvent(new Event(ADMIN_SIGNED_OUT_EVENT));
    throw new ApiError("Your admin session has expired. Please sign in again.", 401);
  }
  try {
    return await request<T>(`/admin${path}`, { ...init, token });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      adminTokenStore.clear();
      window.dispatchEvent(new Event(ADMIN_SIGNED_OUT_EVENT));
    }
    throw error;
  }
}

const json = (method: string, body?: unknown): RequestInit => ({
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export const adminApi = {
  login: (data: AdminLoginRequest) =>
    request<AdminAuthResponse>("/admin/auth/login", json("POST", data)),
  setupStatus: () => request<AdminSetupStatus>("/admin/auth/setup"),
  // Creates the first admin; refused once any admin exists.
  setup: (data: NewAdminRequest) =>
    request<AdminAuthResponse>("/admin/auth/setup", json("POST", data)),
  me: () => adminRequest<AdminProfile>("/auth/me"),
  changePassword: (data: ChangeAdminPasswordRequest) =>
    adminRequest<void>("/auth/password", json("PUT", data)),

  admins: () => adminRequest<AdminAccount[]>("/admins"),
  createAdmin: (data: NewAdminRequest) =>
    adminRequest<AdminAccount>("/admins", json("POST", data)),
  logout: () => adminRequest<void>("/auth/logout", json("POST")),

  overview: () => adminRequest<AdminOverview>("/overview"),
  usage: (from: string, to: string) =>
    adminRequest<AdminUsageReport>(
      `/usage?${new URLSearchParams({ from, to })}`,
    ),

  providerKeys: () => adminRequest<ProviderKeyStatus[]>("/provider-keys"),
  setProviderKey: (provider: Provider, key: string) =>
    adminRequest<ProviderKeyStatus>(`/provider-keys/${provider}`, json("PUT", { key })),
  removeProviderKey: (provider: Provider) =>
    adminRequest<void>(`/provider-keys/${provider}`, json("DELETE")),
  testProviderKey: (provider: Provider) =>
    adminRequest<ProviderKeyStatus>(`/provider-keys/${provider}/test`, json("POST")),

  plans: () => adminRequest<AdminPlan[]>("/plans"),
  updatePlan: (planId: string, data: UpdatePlanRequest) =>
    adminRequest<AdminPlan>(`/plans/${encodeURIComponent(planId)}`, json("PUT", data)),
  setPlanModels: (planId: string, models: PlanModel[]) =>
    adminRequest<AdminPlan>(
      `/plans/${encodeURIComponent(planId)}/models`,
      json("PUT", { models }),
    ),

  users: (search: string, page: number, pageSize: number) =>
    adminRequest<AdminUserList>(
      `/users?${new URLSearchParams({ search, page: String(page), pageSize: String(pageSize) })}`,
    ),
  user: (userId: string) =>
    adminRequest<AdminUserDetail>(`/users/${encodeURIComponent(userId)}`),
  assignPlan: (userId: string, data: AssignPlanRequest) =>
    adminRequest<AdminUserDetail>(
      `/users/${encodeURIComponent(userId)}/plan`,
      json("PUT", data),
    ),
};
