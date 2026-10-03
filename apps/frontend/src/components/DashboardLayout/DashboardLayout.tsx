import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { navItems } from "./navItems";
import { styles } from "./DashboardLayout.style";

const COLLAPSED_KEY = "nakka.sidebarCollapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

// App shell for signed-in pages: sidebar on the left, top bar above the page.
export default function DashboardLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const current =
    navItems.find((item) => item.to === pathname.replace(/\/$/, "")) ??
    navItems[0];

  // Close the mobile drawer whenever the page changes.
  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [mobileOpen]);

  function toggleCollapsed() {
    setCollapsed((previous) => {
      try {
        localStorage.setItem(COLLAPSED_KEY, previous ? "0" : "1");
      } catch {
        // Not remembered; still works for this visit.
      }
      return !previous;
    });
  }

  return (
    <div className={styles.root}>
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={toggleCollapsed}
        onCloseMobile={() => setMobileOpen(false)}
      />
      <div
        className={styles.backdrop(mobileOpen)}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />
      <div className={styles.main}>
        <Topbar title={current.label} onOpenMenu={() => setMobileOpen(true)} />
        <main className={styles.content}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
