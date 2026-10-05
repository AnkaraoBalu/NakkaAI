import { adminStyles } from "../admin.style";

type Tone = "good" | "bad" | "off" | "unknown";

export const styles = {
  ...adminStyles,
  setup:
    "flex items-center gap-space-sm p-space-md rounded-2xl bg-primary-fixed/60 text-on-primary-fixed-variant font-body-md text-body-md font-medium hover:bg-primary-fixed transition-colors",
  split: "grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-space-lg items-start",
  list: "flex flex-col divide-y divide-outline-variant/30",
  row: "flex items-center gap-space-sm py-2.5 first:pt-0 last:pb-0",
  dot: "w-2.5 h-2.5 rounded-full shrink-0",
  status: (tone: Tone) =>
    "ml-auto px-2 py-0.5 rounded-full font-label-sm text-label-sm font-semibold " +
    {
      good: "bg-[#e6fcf5] text-[#087f5b]",
      bad: "bg-error-container text-on-error-container",
      off: "bg-surface-container-low text-outline",
      unknown: "bg-[#fff4e6] text-[#d9480f]",
    }[tone],
  userRow:
    "flex items-center gap-space-sm py-2.5 -mx-2 px-2 rounded-lg hover:bg-surface-container-low transition-colors",
  rank: "w-6 h-6 shrink-0 rounded-full bg-surface-container-low text-on-surface-variant flex items-center justify-center font-label-sm text-label-sm font-semibold",
  email: "flex-1 min-w-0 truncate font-body-md text-body-md text-on-surface",
  activity: "flex items-start gap-space-sm py-2.5 first:pt-0 last:pb-0",
  activityIcon: "material-symbols-outlined text-[18px] text-outline mt-0.5",
  activityText: "font-body-md text-body-md text-on-surface-variant break-words",
  time: "shrink-0 font-label-sm text-label-sm text-outline whitespace-nowrap",
};
