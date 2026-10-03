import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import DashboardLayout from "./components/DashboardLayout";
import Home from "./pages/home/Home";
import NotFound from "./components/NotFound";
import RequireAuth from "./components/RequireAuth";
import PublicOnly from "./components/PublicOnly";
import Dashboard from "./pages/dashboard";
import DashboardSection from "./pages/dashboard/DashboardSection";
import Settings from "./pages/dashboard/Settings";
import SsoCallback from "./pages/sso/SsoCallback";
import ExtensionAuth from "./pages/extension-auth";
import AuthModalProvider from "./context/AuthModalProvider";
import SsoComplete from "./pages/sso/SsoComplete";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import ClerkSetup, { CLERK_PUBLISHABLE_KEY } from "./context/ClerkSetup";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ClerkSetup>
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
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="sessions" element={<DashboardSection />} />
              <Route path="projects" element={<DashboardSection />} />
              <Route path="usage" element={<DashboardSection />} />
              <Route path="settings" element={<Settings />} />
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
      </ClerkSetup>
    </BrowserRouter>
  );
}
