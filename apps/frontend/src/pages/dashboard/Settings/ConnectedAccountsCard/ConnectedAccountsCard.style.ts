import { cardStyles } from "../../../../styles/card.style";

export const styles = {
  ...cardStyles,
  list: "flex flex-col divide-y divide-outline-variant/30",
  row: "flex flex-col sm:flex-row sm:items-center gap-space-sm py-space-md first:pt-0 last:pb-0",
  provider: "flex items-center gap-space-md flex-1 min-w-0",
  logoBox:
    "w-10 h-10 shrink-0 rounded-xl bg-surface-container-low flex items-center justify-center",
  logo: "w-5 h-5",
  name: "font-body-md text-body-md text-on-surface font-semibold",
  detail: "font-body-sm text-body-sm text-on-surface-variant break-all",
  hint: "font-label-sm text-label-sm text-outline",
  badge:
    "inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full bg-[#e6fcf5] text-[#087f5b] font-label-sm text-label-sm align-middle",
  dangerButton:
    "inline-flex items-center justify-center gap-2 px-space-md py-2 rounded-full bg-surface-container-low text-error font-label-md text-label-md font-semibold hover:bg-error-container/50 transition-colors disabled:opacity-50 disabled:pointer-events-none",
};
