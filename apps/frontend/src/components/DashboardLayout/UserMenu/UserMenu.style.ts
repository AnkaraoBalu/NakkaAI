export const styles = {
  root: "relative",
  trigger: (collapsed: boolean) =>
    "w-full flex items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-container transition-colors " +
    (collapsed ? "lg:justify-center" : ""),
  avatar:
    "w-9 h-9 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md text-label-md font-semibold shadow-sm",
  identity: (collapsed: boolean) =>
    "min-w-0 flex-1 " + (collapsed ? "lg:hidden" : ""),
  name: "block truncate font-body-md text-body-md text-on-surface font-medium",
  email: "block truncate font-label-sm text-label-sm text-outline",
  chevron: (collapsed: boolean) =>
    "material-symbols-outlined text-[18px] text-outline " +
    (collapsed ? "lg:hidden" : ""),
  menu: (collapsed: boolean) =>
    "absolute bottom-full mb-2 z-10 w-64 p-1.5 rounded-2xl bg-surface-container-lowest shadow-[0_16px_40px_rgba(23,27,38,0.14)] border border-outline-variant/30 animate-auth-panel " +
    (collapsed ? "left-0 lg:left-full lg:bottom-0 lg:mb-0 lg:ml-2" : "left-0"),
  menuHeader: "px-3 py-2 flex flex-col gap-1",
  plan: "self-start mt-1 px-2 py-0.5 rounded-full bg-surface-container-low font-label-sm text-label-sm text-on-surface-variant",
  divider: "my-1 h-px bg-outline-variant/40",
  item: "w-full flex items-center gap-3 px-3 py-2 rounded-xl font-body-md text-body-md text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors",
  itemIcon: "material-symbols-outlined text-[18px] text-outline",
};
