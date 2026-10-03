// Shared by the Settings cards.
export const cardStyles = {
  card: "flex flex-col gap-space-md p-space-lg rounded-2xl bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(23,27,38,0.04)]",
  header: "flex flex-col gap-1",
  title: "font-headline-sm text-headline-sm text-on-surface font-semibold",
  description: "font-body-sm text-body-sm text-on-surface-variant",
  error:
    "flex items-start gap-2 p-3 rounded-xl bg-error-container/60 text-on-error-container font-body-sm text-body-sm",
  success:
    "flex items-center gap-2 p-3 rounded-xl bg-[#e6fcf5] text-[#087f5b] font-body-sm text-body-sm",
  primaryButton:
    "inline-flex items-center justify-center gap-2 px-space-md py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold hover:bg-primary-container transition-colors disabled:opacity-60 disabled:pointer-events-none",
  secondaryButton:
    "inline-flex items-center justify-center gap-2 px-space-md py-2 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors disabled:opacity-50 disabled:pointer-events-none",
  spinner: "material-symbols-outlined text-[16px] animate-spin",
};
