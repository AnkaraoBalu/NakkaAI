import { cardStyles } from "../card.style";

export const styles = {
  ...cardStyles,
  identity: "flex items-center gap-space-md",
  avatar:
    "w-14 h-14 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-md text-headline-md font-semibold shadow-sm",
  name: "font-headline-sm text-headline-sm text-on-surface font-semibold",
  rows: "grid grid-cols-1 sm:grid-cols-2 gap-space-md",
  label:
    "font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold",
  value:
    "flex items-center gap-1.5 font-body-md text-body-md text-on-surface break-all",
  verified:
    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e6fcf5] text-[#087f5b] font-label-sm text-label-sm",
};
