import { Link, NavLink } from "react-router-dom";
import { VSCODE_INSTALL_URL } from "../../../constants/extension";
import UserMenu from "../UserMenu";
import { navItems } from "../navItems";
import { styles } from "./Sidebar.style";

interface SidebarProps {
  // Desktop: icon-only rail. Mobile always shows the full drawer.
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapsed: () => void;
  onCloseMobile: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}: SidebarProps) {
  return (
    <aside className={styles.root(collapsed, mobileOpen)} aria-label="Sidebar">
      <div className={styles.top(collapsed)}>
        <Link
          to="/dashboard"
          className={`${styles.brand} ${collapsed ? "lg:hidden" : ""}`}
        >
          <img alt="" className={styles.logo} src="/logo3.png" />
          <span className={styles.brandName}>Nakka</span>
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
        <a
          href={VSCODE_INSTALL_URL}
          className={styles.primaryAction(collapsed)}
          title="Open in VS Code"
        >
          <span className="material-symbols-outlined text-[18px]">
            terminal
          </span>
          <span className={styles.label(collapsed)}>Open in VS Code</span>
        </a>

        <nav className={styles.nav} aria-label="Dashboard">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
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

        <div className="flex flex-col gap-space-xs">
          <p className={styles.sectionTitle(collapsed)}>Recent</p>
          <p className={styles.recentEmpty(collapsed)}>
            No sessions yet. Start one from VS Code.
          </p>
        </div>
      </div>

      <div className={styles.footer}>
        <UserMenu collapsed={collapsed} />
      </div>
    </aside>
  );
}
