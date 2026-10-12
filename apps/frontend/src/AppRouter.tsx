import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Routes,
  Route,
} from "react-router-dom";
import PageLoader from "./components/PageLoader";
import SiteLayout from "./components/SiteLayout";
import Home from "./pages/home/Home";
import NotFound from "./components/NotFound";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";
import PublicOnly from "./components/PublicOnly";
import AdminAuthProvider from "./context/AdminAuthProvider";
import SsoCallback from "./pages/sso/SsoCallback";
import ExtensionAuth from "./pages/extension-auth";
import AuthModalProvider from "./context/AuthModalProvider";
import SsoComplete from "./pages/sso/SsoComplete";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import ClerkSetup, { CLERK_PUBLISHABLE_KEY } from "./context/ClerkSetup";

// Signed-in and admin pages load on demand, so the landing page stays light.
const UserLayout = lazy(() => import("./components/UserLayout"));
const AdminLayout = lazy(() => import("./components/AdminLayout"));
const Dashboard = lazy(() => import("./pages/dashboard"));
const Usage = lazy(() => import("./pages/dashboard/Usage"));
const Settings = lazy(() => import("./pages/dashboard/Settings"));
const Billing = lazy(() => import("./pages/dashboard/Billing"));
const AdminLogin = lazy(() => import("./pages/admin/Login"));
const AdminSignup = lazy(() => import("./pages/admin/Signup"));
const AdminAdmins = lazy(() => import("./pages/admin/Admins"));
const AdminOverview = lazy(() => import("./pages/admin/Overview"));
const AdminProviderKeys = lazy(() => import("./pages/admin/ProviderKeys"));
const AdminPlans = lazy(() => import("./pages/admin/Plans"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminUserDetail = lazy(() => import("./pages/admin/UserDetail"));
const AdminUsage = lazy(() => import("./pages/admin/Usage"));

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ClerkSetup>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Marketing site, signed-out only: shared header and footer. */}
            <Route element={<PublicOnly />}>
              <Route element={<SiteLayout />}>
                <Route index element={<Navigate to="/product" replace />} />
                <Route path="product" element={<Home />} />
                <Route path="pricing" element={<Home />} />
                <Route path="code.html" element={<Home />} />
                {/* Cloudflare Pages redirects /code.html to /code. */}
                <Route path="code" element={<Home />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>

            {/* Legal pages: public for everyone, signed in or not (Google links to them). */}
            <Route element={<SiteLayout />}>
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>

            {/* Signed-in app: its own sidebar and top bar. */}
            <Route element={<RequireAuth />}>
              <Route path="dashboard" element={<UserLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="usage" element={<Usage />} />
                <Route path="billing" element={<Billing />} />
                <Route path="settings" element={<Settings />} />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Route>
            </Route>

            {/* Admin dashboard: its own sign-in, separate from users'. */}
            <Route
              path="admin"
              element={
                <AdminAuthProvider>
                  <Outlet />
                </AdminAuthProvider>
              }
            >
              <Route path="login" element={<AdminLogin />} />
              <Route path="signup" element={<AdminSignup />} />
              <Route element={<RequireAdmin />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="keys" element={<AdminProviderKeys />} />
                  <Route path="plans" element={<AdminPlans />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="users/:userId" element={<AdminUserDetail />} />
                  <Route path="usage" element={<AdminUsage />} />
                  <Route path="admins" element={<AdminAdmins />} />
                  <Route path="*" element={<Navigate to="/admin" replace />} />
                </Route>
              </Route>
            </Route>

            {/* VS Code extension sign-in: works signed in or out. */}
            <Route
              path="auth"
              element={
                <AuthModalProvider>
                  <ExtensionAuth />
                </AuthModalProvider>
              }
            />

            {/* Google/GitHub return here through Clerk. */}
            {CLERK_PUBLISHABLE_KEY && (
              <>
                <Route path="sso-callback" element={<SsoCallback />} />
                <Route path="sso-callback/complete" element={<SsoComplete />} />
              </>
            )}
          </Routes>
        </Suspense>
      </ClerkSetup>
    </BrowserRouter>
  );
}
