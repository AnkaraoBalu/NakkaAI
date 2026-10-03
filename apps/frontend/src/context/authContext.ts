import { createContext } from "react";
import type { LoginRequest, SignupRequest, User } from "@nakka/types/users";

export type AuthStatus = "loading" | "authenticated" | "anonymous";

export interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (data: LoginRequest) => Promise<User>;
  signup: (data: SignupRequest) => Promise<User>;
  // Google/GitHub: exchange a Clerk session token for a Nakka session.
  loginWithClerk: (token: string) => Promise<User>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
