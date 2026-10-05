import type { NavItem } from "../DashboardLayout";

// Sidebar entries for the user dashboard; the top bar also uses them to title the page.
export const navItems: NavItem[] = [
  {
    label: "Overview",
    to: "/dashboard",
    icon: "space_dashboard",
    description: "Your plan and usage at a glance.",
  },
  {
    label: "Usage",
    to: "/dashboard/usage",
    icon: "monitoring",
    description: "Your allowance, models and request history.",
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: "settings",
    description: "Your profile and the ways you sign in.",
  },
];
