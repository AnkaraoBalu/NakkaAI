import { adminStyles } from "../admin.style";

export const styles = {
  ...adminStyles,
  searchBox:
    "flex items-center gap-2 w-full md:max-w-md px-space-md rounded-full bg-surface-container-lowest/80 shadow-[0_8px_32px_rgba(23,27,38,0.04)] focus-within:ring-4 focus-within:ring-primary-fixed/50 transition-shadow",
  searchInput:
    "flex-1 min-w-0 py-2.5 bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none",
  identity: "flex items-center gap-space-sm min-w-0",
  avatar:
    "w-8 h-8 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md text-label-md font-semibold",
  name: "block truncate font-body-md text-body-md text-on-surface font-medium",
  email: "block truncate font-label-sm text-label-sm text-outline",
  pager: "flex items-center justify-between gap-space-sm pt-space-sm",
};
