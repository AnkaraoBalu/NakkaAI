import { adminStyles } from "../admin.style";

export const styles = {
  ...adminStyles,
  split: "grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start",
  identity: "flex items-center gap-space-sm min-w-0",
  avatar:
    "w-8 h-8 shrink-0 rounded-full bg-inverse-surface text-inverse-on-surface flex items-center justify-center font-label-md text-label-md font-semibold",
  name: "flex items-center gap-2 truncate font-body-md text-body-md text-on-surface font-medium",
  you: "px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-sm text-label-sm font-semibold",
  email: "block truncate font-label-sm text-label-sm text-outline",
};
