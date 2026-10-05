import { cardStyles } from "../../styles/card.style";

// Shared by the admin pages.
export const adminStyles = {
  ...cardStyles,
  page: "flex flex-col gap-space-lg",
  intro: "font-body-lg text-body-lg text-on-surface-variant",
  toolbar: "flex flex-col md:flex-row md:items-center md:justify-between gap-space-md",
  pageError:
    "p-3 rounded-xl bg-error-container/60 text-on-error-container font-body-md text-body-md",
  loading: "flex items-center gap-2 text-outline font-body-md text-body-md",
  loadingIcon: "material-symbols-outlined text-[18px] animate-spin",
  stats: "grid grid-cols-2 lg:grid-cols-4 gap-space-md",
  cardHead: "flex items-start justify-between gap-space-md",
  link: "inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-primary hover:underline underline-offset-4",
  muted: "font-body-sm text-body-sm text-outline",
  strong: "font-body-md text-body-md text-on-surface font-semibold",
  dangerButton:
    "inline-flex items-center justify-center gap-2 px-space-md py-2 rounded-full bg-surface-container-low text-error font-label-md text-label-md font-semibold hover:bg-error-container/50 transition-colors disabled:opacity-50 disabled:pointer-events-none",
  input:
    "w-full rounded-xl bg-surface-container-low px-space-md py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline border border-transparent transition-all duration-150 focus:outline-none focus:bg-surface-container-lowest focus:ring-4 focus:border-primary/50 focus:ring-primary-fixed/50",
};
