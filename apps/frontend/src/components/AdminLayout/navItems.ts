import type { NavItem } from "../DashboardLayout";

// Sidebar entries for the admin dashboard.
export const navItems: NavItem[] = [
  {
    label: "Overview",
    to: "/admin",
    icon: "space_dashboard",
    description: "Users, traffic and provider health at a glance.",
  },
  {
    label: "API keys",
    to: "/admin/keys",
    icon: "key",
    description: "Nakka's keys for each AI provider.",
  },
  {
    label: "Plans",
    to: "/admin/plans",
    icon: "workspace_premium",
    description: "Models and allowances for each plan.",
  },
  {
    label: "Users",
    to: "/admin/users",
    icon: "group",
    description: "Everyone who signed up, and their plans.",
  },
  {
    label: "Usage",
    to: "/admin/usage",
    icon: "monitoring",
    description: "Requests and tokens across all users.",
  },
  {
    label: "Admins",
    to: "/admin/admins",
    icon: "admin_panel_settings",
    description: "Your password and the admin team.",
  },
];
