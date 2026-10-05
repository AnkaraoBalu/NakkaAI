import { cardStyles } from "../../../styles/card.style";

export const styles = {
  ...cardStyles,
  root: "flex flex-col gap-space-lg",
  toolbar: "flex flex-col md:flex-row md:items-center md:justify-between gap-space-md",
  intro: "font-body-lg text-body-lg text-on-surface-variant",
  actions: "flex items-center gap-space-sm",
  iconButton:
    "w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant bg-surface-container-low hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-60",
  error:
    "p-3 rounded-xl bg-error-container/60 text-on-error-container font-body-md text-body-md",
  loading: "flex items-center gap-2 text-outline font-body-md text-body-md",
  stats: "grid grid-cols-2 lg:grid-cols-4 gap-space-md",
  split: "grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-space-lg items-start",
  models: "flex flex-col divide-y divide-outline-variant/30",
  model: "flex items-center gap-space-sm py-2.5 first:pt-0 last:pb-0",
  dot: "w-2.5 h-2.5 rounded-full shrink-0",
  mono: "font-body-md text-body-md text-on-surface font-semibold break-all",
  provider: "ml-auto font-label-sm text-label-sm text-outline whitespace-nowrap",
};
