import { adminStyles } from "../../admin.style";

export const styles = {
  ...adminStyles,
  field: "flex flex-col gap-1.5 max-w-sm",
  fieldLabel: "font-label-md text-label-md text-on-surface-variant font-medium",
  rows: "flex flex-col gap-space-sm",
  rowHead:
    "hidden md:grid grid-cols-[1.6fr_1fr_1.4fr_1fr_auto] gap-space-sm px-1 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold",
  row: "grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1.4fr_1fr_auto] gap-space-sm items-center p-space-sm md:p-0 rounded-xl bg-surface-container-low/50 md:bg-transparent [&>:first-child]:col-span-2 md:[&>:first-child]:col-span-1",
  resets: "flex items-center gap-space-xs",
  select: adminStyles.input + " pr-8 disabled:opacity-50",
  hours: "relative block w-24 shrink-0",
  hoursInput: adminStyles.input + " pr-7",
  unit: "absolute right-3 top-1/2 -translate-y-1/2 font-body-sm text-body-sm text-outline pointer-events-none",
  money: "relative block",
  currency:
    "absolute left-space-md top-1/2 -translate-y-1/2 font-body-md text-body-md text-outline pointer-events-none",
  moneyInput: adminStyles.input + " pl-8",
  removeButton:
    "w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error-container/50 transition-colors",
  unlimited:
    "flex items-center gap-2 p-3 rounded-xl bg-surface-container-low font-body-md text-body-md text-on-surface-variant",
  addRow: "flex flex-wrap gap-space-sm",
  footer: "flex flex-wrap items-center gap-space-sm pt-space-sm border-t border-outline-variant/30",
};
