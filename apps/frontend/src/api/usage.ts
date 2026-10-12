import type { MyUsage } from "@nakka/types/usage";
import { ApiError, request } from "./http";
import { tokenStore } from "./session";

// The signed-in user's plan and how much of each allowance window is used.
export const usageApi = {
  mine: () => {
    const token = tokenStore.get();
    if (!token)
      throw new ApiError("Your session has expired. Please log in again.", 401);
    return request<MyUsage>("/usage", { token });
  },
};
