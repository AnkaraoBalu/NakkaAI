import { Link } from "react-router-dom";
import { useUsage } from "../../api-hooks/usage";
import { VSCODE_INSTALL_URL } from "../../constants/extension";
import DashboardLayout from "../DashboardLayout";
import PlanBadge from "../PlanBadge";
import UserMenu from "./UserMenu";
import { navItems } from "./navItems";
import { styles } from "./UserLayout.style";

// The signed-in user's dashboard shell.
export default function UserLayout() {
  const { data } = useUsage();
  const plan = data?.plan;

  return (
    <DashboardLayout
      navItems={navItems}
      homeTo="/dashboard"
      sidebarAction={(collapsed) => (
        <a
          href={VSCODE_INSTALL_URL}
          className={styles.openInVsCode(collapsed)}
          title="Open in VS Code"
        >
          <span className="material-symbols-outlined text-[18px]">terminal</span>
          <span className={collapsed ? "lg:hidden" : ""}>Open in VS Code</span>
        </a>
      )}
      sidebarFooter={(collapsed) => (
        <UserMenu collapsed={collapsed} planName={plan?.name} />
      )}
      topbarActions={
        <>
          {plan && (
            <Link to="/dashboard/usage" className={styles.plan} title="See your usage">
              <PlanBadge planId={plan.id} name={`${plan.name} plan`} />
            </Link>
          )}
          <a href={VSCODE_INSTALL_URL} className={styles.install}>
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span className="hidden sm:inline">Install extension</span>
            <span className="sm:hidden">Install</span>
          </a>
        </>
      }
    />
  );
}
