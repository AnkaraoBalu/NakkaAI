import { adminStyles } from "../admin.style";

export const styles = {
  ...adminStyles,
  back: "self-start inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors",
  profile:
    "flex flex-col md:flex-row md:items-center gap-space-md p-space-lg rounded-2xl bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(23,27,38,0.04)]",
  avatar:
    "w-14 h-14 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-sm text-headline-sm font-semibold",
  name: "font-headline-md text-headline-md text-on-surface font-semibold tracking-tight truncate",
  email: "font-body-md text-body-md text-on-surface-variant truncate",
  facts:
    "grid grid-cols-2 sm:grid-cols-4 gap-x-space-lg gap-y-space-sm m-0 font-body-sm text-body-sm text-on-surface",
  factLabel: "font-label-sm text-label-sm text-outline",
  split: "grid grid-cols-1 lg:grid-cols-2 gap-space-lg items-start",
  meters: "flex flex-col gap-space-lg",
};
