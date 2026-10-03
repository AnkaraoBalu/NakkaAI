export interface NavItem {
  label: string;
  to: string;
  icon: string;
  description: string;
}

// Sidebar entries; the top bar also uses them to title the current page.
export const navItems: NavItem[] = [
  {
    label: "Overview",
    to: "/dashboard",
    icon: "space_dashboard",
    description: "Your workspace at a glance.",
  },
  {
    label: "Sessions",
    to: "/dashboard/sessions",
    icon: "forum",
    description: "Conversations you've had with the agent in VS Code.",
  },
  {
    label: "Projects",
    to: "/dashboard/projects",
    icon: "folder_open",
    description: "Codebases Nakka has indexed for you.",
  },
  {
    label: "Usage",
    to: "/dashboard/usage",
    icon: "monitoring",
    description: "Requests and tokens used this billing period.",
  },
  {
    label: "Settings",
    to: "/dashboard/settings",
    icon: "settings",
    description: "Your profile and the ways you sign in.",
  },
];
