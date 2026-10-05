import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdminAuth } from "../../api-hooks/admin";
import PageLoader from "../PageLoader";

// Route guard: renders the admin pages only for a signed-in admin.
export default function RequireAdmin() {
  const { status } = useAdminAuth();
  const { pathname } = useLocation();

  if (status === "loading") return <PageLoader />;
  if (status === "anonymous") {
    return <Navigate to="/admin/login" replace state={{ from: pathname }} />;
  }
  return <Outlet />;
}
