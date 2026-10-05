import { useContext } from "react";
import { AdminAuthContext } from "../../context/adminAuthContext";

// The signed-in admin plus login and logout. Requires <AdminAuthProvider> (the /admin routes).
export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return context;
}
