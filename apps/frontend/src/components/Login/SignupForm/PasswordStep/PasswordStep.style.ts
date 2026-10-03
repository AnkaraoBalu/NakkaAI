import { formStyles } from "../../AuthForm.style";

export const styles = {
  ...formStyles,
  verified:
    "self-center inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e6fcf5] text-[#087f5b] font-label-sm text-label-sm font-medium max-w-full",
  verifiedIcon: "material-symbols-outlined text-[16px] shrink-0",
  verifiedEmail: "truncate",
  strength: "flex items-center gap-space-sm",
  strengthBars: "flex flex-1 gap-1",
  strengthBar: (filled: boolean, tone: string) =>
    "h-1 flex-1 rounded-full transition-colors duration-300 " +
    (filled ? tone : "bg-surface-container-high"),
  strengthLabel:
    "font-label-sm text-label-sm text-on-surface-variant w-16 text-right",
  // Bar colour for each strength score (1-4).
  strengthTone: {
    1: "bg-error",
    2: "bg-[#f59e0b]",
    3: "bg-primary",
    4: "bg-[#10b981]",
  } as Record<number, string>,
  match: "flex items-center gap-1 font-label-sm text-label-sm text-[#10b981]",
  matchIcon: "material-symbols-outlined text-[14px]",
  terms: "text-center font-label-sm text-label-sm text-outline",
};
