import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, User } from "@nakka/types/users";
import { ApiError, authApi } from "../api/auth";
import { tokenStore } from "../api/session";
import { AuthContext, type AuthStatus } from "./authContext";

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    tokenStore.get() ? "loading" : "anonymous",
  );

  // Restore the session saved by a previous visit.
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) return;
    let cancelled = false;
    authApi
      .me(token)
      .then((current) => {
        if (cancelled) return;
        setUser(current);
        setStatus("authenticated");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        if (error instanceof ApiError && error.status === 401)
          tokenStore.clear();
        setStatus("anonymous");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const startSession = useCallback((response: AuthResponse) => {
    tokenStore.set(response.token);
    setUser(response.user);
    setStatus("authenticated");
    return response.user;
  }, []);

  const value = useMemo(
    () => ({
      user,
      status,
      login: async (data: Parameters<typeof authApi.login>[0]) =>
        startSession(await authApi.login(data)),
      signup: async (data: Parameters<typeof authApi.signup>[0]) =>
        startSession(await authApi.signup(data)),
      loginWithClerk: async (token: string) =>
        startSession(await authApi.loginWithClerk(token)),
      logout: async () => {
        const token = tokenStore.get();
        tokenStore.clear();
        setUser(null);
        setStatus("anonymous");
        // Signed out locally either way; the server call just revokes the token.
        if (token) await authApi.logout(token).catch(() => undefined);
      },
    }),
    [user, status, startSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
