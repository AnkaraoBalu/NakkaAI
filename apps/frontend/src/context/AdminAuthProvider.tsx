import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AdminAuthResponse, AdminProfile } from "@nakka/types/admin";
import { adminApi } from "../api/admin";
import { ApiError } from "../api/http";
import { ADMIN_SIGNED_OUT_EVENT, adminTokenStore } from "../api/adminSession";
import { AdminAuthContext } from "./adminAuthContext";
import type { AuthStatus } from "./authContext";

// The admin session for the /admin pages. Separate from the user's AuthProvider.
export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    adminTokenStore.get() ? "loading" : "anonymous",
  );

  // Restore a saved admin session.
  useEffect(() => {
    if (!adminTokenStore.get()) return;
    let cancelled = false;
    adminApi
      .me()
      .then((current) => {
        if (cancelled) return;
        setAdmin(current);
        setStatus("authenticated");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401) adminTokenStore.clear();
        setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Any admin request answered 401: back to the sign-in screen.
  useEffect(() => {
    const signedOut = () => {
      setAdmin(null);
      setStatus("anonymous");
    };
    window.addEventListener(ADMIN_SIGNED_OUT_EVENT, signedOut);
    return () => window.removeEventListener(ADMIN_SIGNED_OUT_EVENT, signedOut);
  }, []);

  const startSession = useCallback((response: AdminAuthResponse) => {
    adminTokenStore.set(response.token);
    setAdmin(response.admin);
    setStatus("authenticated");
    return response.admin;
  }, []);

  const value = useMemo(
    () => ({
      admin,
      status,
      login: async (data: Parameters<typeof adminApi.login>[0]) =>
        startSession(await adminApi.login(data)),
      setup: async (data: Parameters<typeof adminApi.setup>[0]) =>
        startSession(await adminApi.setup(data)),
      logout: async () => {
        // Revoke on the server first, while the token is still known.
        await adminApi.logout().catch(() => undefined);
        adminTokenStore.clear();
        setAdmin(null);
        setStatus("anonymous");
      },
    }),
    [admin, status, startSession],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}
