import type { MyUsage } from "@nakka/types/usage";
import { ApiError, request } from "./http";
import { tokenStore } from "./session";

export type UsageDays = 7 | 30 | 90;

// The signed-in user's plan, allowance windows and usage history.
export const usageApi = {
  mine: (days: UsageDays) => {
    const token = tokenStore.get();
    if (!token)
      throw new ApiError("Your session has expired. Please log in again.", 401);
    return request<MyUsage>(`/usage?days=${days}`, { token });
  },
};
