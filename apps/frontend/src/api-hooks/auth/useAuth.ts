import { useContext } from "react";
import { AuthContext } from "../../context/authContext";

// Current user plus login, signup and logout. Requires <AuthProvider> (set up in main.tsx).
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
