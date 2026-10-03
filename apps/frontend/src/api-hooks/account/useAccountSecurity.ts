import { useCallback, useEffect, useState } from "react";
import type { AccountSecurity } from "@nakka/types/users";
import { accountApi } from "../../api/account";

// The signed-in user's password status and connected Google/GitHub accounts.
export function useAccountSecurity() {
  const [data, setData] = useState<AccountSecurity | null>(null);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    try {
      setData(await accountApi.security());
      setError("");
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : "Couldn't load your account.",
      );
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return { data, setData, error, reload };
}
