import { adminStyles } from "../admin.style";

export const styles = {
  ...adminStyles,
  custom: "flex flex-wrap items-end gap-space-md",
  dateField: "flex flex-col gap-1 font-label-md text-label-md text-on-surface-variant",
  dateInput:
    "rounded-xl bg-surface-container-lowest/80 px-space-md py-2 font-body-md text-body-md text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-4 focus:border-primary/50 focus:ring-primary-fixed/50",
  results: (loading: boolean) =>
    "flex flex-col gap-space-lg transition-opacity " + (loading ? "opacity-60" : ""),
  split: "grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-space-lg items-start",
  providers: "flex flex-col gap-space-md",
  provider: "flex flex-col gap-1.5",
  providerTop: "flex items-baseline justify-between gap-space-sm",
  track: "h-2 rounded-full bg-surface-container-high overflow-hidden",
  fill: "h-full rounded-full",
};
