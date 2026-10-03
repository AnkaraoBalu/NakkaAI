import { createContext, useContext } from "react";

export type AuthMode = "login" | "signup";

export interface AuthModalContextValue {
  openAuth: (mode: AuthMode) => void;
  closeAuth: () => void;
}

export const AuthModalContext = createContext<AuthModalContextValue | null>(
  null,
);

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error("useAuthModal must be used inside AuthModalProvider");
  }
  return context;
}
