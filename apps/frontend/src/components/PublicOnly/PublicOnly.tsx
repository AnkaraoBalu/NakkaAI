import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../api-hooks/auth";
import PageLoader from "../PageLoader";

// Route guard for the marketing site: signed-in users are sent to the dashboard,
// so they only see these pages again after logging out.
export default function PublicOnly() {
  const { status } = useAuth();

  if (status === "loading") return <PageLoader />;
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
