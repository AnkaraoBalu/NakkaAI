import { useLocation } from "react-router-dom";
import { navItems } from "../../../components/DashboardLayout/navItems";
import { styles } from "./DashboardSection.style";

// Empty page for sidebar sections that don't have content yet.
export default function DashboardSection() {
  const { pathname } = useLocation();
  const item = navItems.find(
    (entry) => entry.to === pathname.replace(/\/$/, ""),
  );
  if (!item) return null;

  return (
    <div className={styles.root}>
      <p className={styles.description}>{item.description}</p>
      <div className={styles.empty}>
        <span className={styles.emptyIcon} aria-hidden="true">
          <span className="material-symbols-outlined text-[28px]">
            {item.icon}
          </span>
        </span>
        <p className={styles.emptyTitle}>Nothing here yet</p>
        <p className={styles.emptyText}>
          {item.label} will appear here once you start using Nakka in VS Code.
        </p>
      </div>
    </div>
  );
}
