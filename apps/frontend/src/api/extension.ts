import type { ExtensionAuthCompleteResponse } from "@nakka/types/extension";
import { ApiError, request } from "./http";
import { tokenStore } from "./session";

// The website half of "Sign in" in the VS Code extension.
export const extensionApi = {
  // Record the attempt the extension started (state + vscode:// return address).
  start: (state: string, redirect: string) =>
    request<void>("/extension/auth/start", {
      method: "POST",
      body: JSON.stringify({ state, redirect }),
    }),
  // Issue the extension's token for the signed-in user; returns the vscode:// URL.
  complete: (state: string) => {
    const token = tokenStore.get();
    if (!token) throw new ApiError("Please log in first.", 401);
    return request<ExtensionAuthCompleteResponse>("/extension/auth/complete", {
      method: "POST",
      token,
      body: JSON.stringify({ state }),
    });
  },
};
