import type { AccountSecurity, SetPasswordRequest } from "@nakka/types/users";
import { ApiError, request } from "./http";
import { tokenStore } from "./session";

function token(): string {
  const value = tokenStore.get();
  if (!value)
    throw new ApiError("Your session has expired. Please log in again.", 401);
  return value;
}

// Sign-in methods for the signed-in user (Settings page).
export const accountApi = {
  security: () =>
    request<AccountSecurity>("/account/security", { token: token() }),
  // Attach the Google/GitHub account just signed in to through Clerk.
  connect: (clerkToken: string) =>
    request<AccountSecurity>("/account/identities/clerk", {
      method: "POST",
      token: token(),
      body: JSON.stringify({ token: clerkToken }),
    }),
  disconnect: (identityId: string) =>
    request<AccountSecurity>(`/account/identities/${identityId}`, {
      method: "DELETE",
      token: token(),
    }),
  setPassword: (data: SetPasswordRequest) =>
    request<AccountSecurity>("/account/password", {
      method: "PUT",
      token: token(),
      body: JSON.stringify(data),
    }),
};
