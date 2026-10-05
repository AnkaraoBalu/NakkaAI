import type { MyUsage } from "@nakka/types/usage";
import { tokenStore } from "../../api/session";
import { usageApi, type UsageDays } from "../../api/usage";
import { useApiData } from "../useApiData";

// The top bar, Overview and Usage pages all ask for this at once; share one
// request and reuse the answer briefly so the numbers on screen agree.
// Keyed by session too, so another account in the same tab never sees it.
const FRESH_MS = 15_000;
const cache = new Map<string, { at: number; promise: Promise<MyUsage> }>();
const keyFor = (days: UsageDays) => `${tokenStore.get()}|${days}`;

function fetchUsage(days: UsageDays): Promise<MyUsage> {
  const key = keyFor(days);
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < FRESH_MS) return hit.promise;
  const promise = usageApi.mine(days);
  cache.set(key, { at: Date.now(), promise });
  promise.catch(() => cache.delete(key));
  return promise;
}

// The signed-in user's plan, allowance windows and the last `days` of usage.
export function useUsage(days: UsageDays = 30) {
  const state = useApiData(() => fetchUsage(days), [days]);
  return {
    ...state,
    refresh: async () => {
      cache.delete(keyFor(days));
      await state.reload();
    },
  };
}
