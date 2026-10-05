export const styles = {
  root: (collapsed: boolean) =>
    "flex items-center gap-3 rounded-xl p-2 " +
    (collapsed ? "lg:flex-col lg:gap-2" : ""),
  avatar:
    "w-9 h-9 shrink-0 rounded-full bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-label-md text-label-md font-semibold shadow-sm",
  identity: (collapsed: boolean) =>
    "min-w-0 flex-1 " + (collapsed ? "lg:hidden" : ""),
  name: "block truncate font-body-md text-body-md text-on-surface font-medium",
  email: "block truncate font-label-sm text-label-sm text-outline",
  signOut:
    "w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error-container/50 transition-colors disabled:opacity-50",
};
