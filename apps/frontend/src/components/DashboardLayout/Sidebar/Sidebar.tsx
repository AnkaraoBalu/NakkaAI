import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import type { NavItem } from "../DashboardLayout";
import { styles } from "./Sidebar.style";

interface SidebarProps {
  navItems: NavItem[];
  homeTo: string;
  brandTag?: string;
  action?: ReactNode;
  footer: ReactNode;
  // Desktop: icon-only rail. Mobile always shows the full drawer.
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  navItems,
  homeTo,
  brandTag,
  action,
  footer,
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarProps) {
  return (
    <aside className={styles.root(collapsed, mobileOpen)} aria-label="Sidebar">
      <div className={styles.top(collapsed)}>
        <Link
          to={homeTo}
          className={`${styles.brand} ${collapsed ? "lg:hidden" : ""}`}
        >
          <img alt="" className={styles.logo} src="/logo3.png" />
          <span className={styles.brandName}>Nakka</span>
          {brandTag && <span className={styles.brandTag}>{brandTag}</span>}
        </Link>
        <button
          type="button"
          className={`${styles.iconButton} hidden lg:flex`}
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <span className={styles.icon}>
            {collapsed ? "left_panel_open" : "left_panel_close"}
          </span>
        </button>
        <button
          type="button"
          className={`${styles.iconButton} lg:hidden`}
          onClick={onCloseMobile}
          aria-label="Close menu"
        >
          <span className={styles.icon}>close</span>
        </button>
      </div>

      <div className={styles.body}>
        {action}

        <nav className={styles.nav} aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              // Section roots (Overview) match exactly; others also own sub-pages.
              end={item.to === homeTo}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) => styles.navLink(isActive, collapsed)}
            >
              {({ isActive }) => (
                <>
                  <span className={styles.navIcon(isActive)}>{item.icon}</span>
                  <span className={styles.label(collapsed)}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className={styles.footer}>{footer}</div>
    </aside>
  );
}
