import { useEffect } from "react";
import type { MyUsage } from "@nakka/types/usage";
import { tokenStore } from "../../api/session";
import { usageApi } from "../../api/usage";
import { useApiData } from "../useApiData";

// The top bar, Overview and Usage pages all ask for this at once; share one
// request and reuse the answer briefly so the numbers on screen agree.
// Keyed by session, so another account in the same tab never sees it.
const FRESH_MS = 15_000;
let cached: { key: string; at: number; promise: Promise<MyUsage> } | null = null;

function fetchUsage(): Promise<MyUsage> {
  const key = String(tokenStore.get());
  if (cached && cached.key === key && Date.now() - cached.at < FRESH_MS) {
    return cached.promise;
  }
  const promise = usageApi.mine();
  const entry = { key, at: Date.now(), promise };
  cached = entry;
  promise.catch(() => {
    if (cached === entry) cached = null;
  });
  return promise;
}

const USAGE_CHANGED_EVENT = "nakka:usage-changed";

// Call after something changes the user's plan (e.g. a payment) so every
// screen showing it, like the top bar's plan badge, loads it again.
export function usageChanged() {
  cached = null;
  window.dispatchEvent(new Event(USAGE_CHANGED_EVENT));
}

// The signed-in user's plan and allowance windows.
export function useUsage() {
  const state = useApiData(fetchUsage, []);
  const { reload } = state;
  useEffect(() => {
    const onChange = () => void reload();
    window.addEventListener(USAGE_CHANGED_EVENT, onChange);
    return () => window.removeEventListener(USAGE_CHANGED_EVENT, onChange);
  }, [reload]);
  return {
    ...state,
    refresh: async () => {
      cached = null;
      await state.reload();
    },
  };
}
