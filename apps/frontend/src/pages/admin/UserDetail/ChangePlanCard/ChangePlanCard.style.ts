import { adminStyles } from "../../admin.style";

export const styles = {
  ...adminStyles,
  options: "grid grid-cols-1 sm:grid-cols-2 gap-space-sm border-0 p-0 m-0",
  option: (active: boolean) =>
    "flex flex-col gap-0.5 p-space-md rounded-xl border-2 cursor-pointer transition-colors focus-within:ring-4 focus-within:ring-primary-fixed/50 " +
    (active
      ? "border-primary bg-primary-fixed/30"
      : "border-outline-variant/40 hover:border-outline-variant"),
  optionName: "font-body-md text-body-md text-on-surface font-semibold",
  endRow: "flex flex-wrap items-center gap-space-md",
  checkbox:
    "inline-flex items-center gap-2 font-body-md text-body-md text-on-surface cursor-pointer [&>input]:w-4 [&>input]:h-4 [&>input]:accent-primary",
  dateInput:
    "rounded-xl bg-surface-container-low px-space-md py-2 font-body-md text-body-md text-on-surface border border-transparent focus:outline-none focus:ring-4 focus:border-primary/50 focus:ring-primary-fixed/50",
};
