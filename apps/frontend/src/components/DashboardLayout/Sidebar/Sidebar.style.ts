export const styles = {
  root: (collapsed: boolean, mobileOpen: boolean) =>
    "fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-surface-container-low/95 backdrop-blur-xl border-r border-outline-variant/30 transition-[transform,width] duration-200 ease-out lg:static lg:z-auto lg:translate-x-0 " +
    (mobileOpen ? "translate-x-0 shadow-2xl " : "-translate-x-full ") +
    (collapsed ? "lg:w-[76px]" : "lg:w-64"),
  top: (collapsed: boolean) =>
    "h-16 shrink-0 flex items-center gap-space-sm px-space-md " +
    (collapsed ? "lg:justify-center lg:px-0" : "justify-between"),
  brand: "flex items-center gap-space-sm min-w-0 rounded-full",
  logo: "w-8 h-8 shrink-0 rounded-full object-contain shadow-sm",
  brandName:
    "font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold",
  brandTag:
    "px-2 py-0.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-semibold",
  iconButton:
    "w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors",
  icon: "material-symbols-outlined text-[20px]",
  body: "flex-1 min-h-0 overflow-y-auto px-space-sm pb-space-md flex flex-col gap-space-md",
  nav: "flex flex-col gap-0.5",
  navLink: (active: boolean, collapsed: boolean) =>
    "group flex items-center gap-3 rounded-xl font-body-md text-body-md transition-colors " +
    (collapsed ? "lg:justify-center lg:h-11 px-3 py-2 lg:p-0 " : "px-3 py-2 ") +
    (active
      ? "bg-surface-container-lowest text-primary font-medium shadow-sm"
      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"),
  navIcon: (active: boolean) =>
    "material-symbols-outlined text-[20px] " +
    (active ? "text-primary" : "text-outline group-hover:text-on-surface"),
  label: (collapsed: boolean) => (collapsed ? "lg:hidden" : ""),
  footer: "shrink-0 p-space-sm border-t border-outline-variant/30",
};
