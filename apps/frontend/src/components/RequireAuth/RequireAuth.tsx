import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../api-hooks/auth";
import PageLoader from "../PageLoader";

// Route guard: renders the child routes only for a signed-in user.
export default function RequireAuth() {
  const { status } = useAuth();

  // A saved session is still being checked; don't redirect yet.
  if (status === "loading") return <PageLoader />;
  if (status === "anonymous") return <Navigate to="/product" replace />;
  return <Outlet />;
}
