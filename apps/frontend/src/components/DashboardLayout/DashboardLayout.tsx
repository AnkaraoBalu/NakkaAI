import { useEffect, useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { styles } from "./DashboardLayout.style";

export interface NavItem {
  label: string;
  to: string;
  icon: string;
  description: string;
}

export interface DashboardLayoutProps {
  navItems: NavItem[];
  // Where the logo links to.
  homeTo: string;
  // Small tag next to the logo, e.g. "Admin".
  brandTag?: string;
  // Button above the navigation (gets the desktop "collapsed" state).
  sidebarAction?: (collapsed: boolean) => ReactNode;
  // Account menu at the bottom of the sidebar.
  sidebarFooter: (collapsed: boolean) => ReactNode;
  // Right side of the top bar.
  topbarActions?: ReactNode;
}

const COLLAPSED_KEY = "nakka.sidebarCollapsed";

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === "1";
  } catch {
    return false;
  }
}

// The current page's nav entry: exact match, else the deepest parent
// (so /admin/users/123 is titled "Users").
function currentItem(navItems: NavItem[], pathname: string) {
  const path = pathname.replace(/\/$/, "");
  return (
    navItems.find((item) => item.to === path) ??
    [...navItems]
      .filter((item) => path.startsWith(`${item.to}/`))
      .sort((a, b) => b.to.length - a.to.length)[0] ??
    navItems[0]
  );
}

// App shell for signed-in pages (user dashboard and admin): sidebar on the
// left, top bar above the page.
export default function DashboardLayout({
  navItems,
  homeTo,
  brandTag,
  sidebarAction,
  sidebarFooter,
  topbarActions,
}: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = currentItem(navItems, pathname);

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
        navItems={navItems}
        homeTo={homeTo}
        brandTag={brandTag}
        action={sidebarAction?.(collapsed)}
        footer={sidebarFooter(collapsed)}
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
        <Topbar title={current.label} onOpenMenu={() => setMobileOpen(true)}>
          {topbarActions}
        </Topbar>
        <main className={styles.content}>
          <div className={styles.contentInner}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
