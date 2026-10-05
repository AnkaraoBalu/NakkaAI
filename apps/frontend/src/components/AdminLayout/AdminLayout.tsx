import DashboardLayout from "../DashboardLayout";
import AdminMenu from "./AdminMenu";
import { navItems } from "./navItems";
import { styles } from "./AdminLayout.style";

// The admin dashboard shell: same look as the user dashboard, admin navigation.
export default function AdminLayout() {
  return (
    <DashboardLayout
      navItems={navItems}
      homeTo="/admin"
      brandTag="Admin"
      sidebarFooter={(collapsed) => <AdminMenu collapsed={collapsed} />}
      topbarActions={
        <a href="/" className={styles.site} target="_blank" rel="noreferrer">
          <span className="material-symbols-outlined text-[16px]">open_in_new</span>
          <span className="hidden sm:inline">View site</span>
        </a>
      }
    />
  );
}
