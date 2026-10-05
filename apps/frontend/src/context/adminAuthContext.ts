import { createContext } from "react";
import type { AdminLoginRequest, AdminProfile, NewAdminRequest } from "@nakka/types/admin";
import type { AuthStatus } from "./authContext";

export interface AdminAuthContextValue {
  admin: AdminProfile | null;
  status: AuthStatus;
  login: (data: AdminLoginRequest) => Promise<AdminProfile>;
  // Creates the first admin account and signs in.
  setup: (data: NewAdminRequest) => Promise<AdminProfile>;
  logout: () => Promise<void>;
}

export const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);
