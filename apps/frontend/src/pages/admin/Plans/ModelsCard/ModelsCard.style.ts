import { adminStyles } from "../../admin.style";

export const styles = {
  ...adminStyles,
  rows: "flex flex-col gap-space-sm m-0 p-0 list-none",
  rowHead:
    "hidden md:grid grid-cols-[1.4fr_1fr_1.4fr_auto] gap-space-sm px-1 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold",
  row: "grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1.4fr_auto] gap-space-sm items-center p-space-sm md:p-space-sm rounded-xl bg-surface-container-low/50 border border-outline-variant/30",
  prices:
    "md:col-span-3 grid grid-cols-2 md:grid-cols-[repeat(4,1fr)_auto_auto] gap-space-sm items-end",
  premium:
    "col-span-2 md:col-span-1 pb-2 inline-flex items-center gap-2 font-label-md text-label-md text-on-surface whitespace-nowrap cursor-pointer [&>input]:w-4 [&>input]:h-4 [&>input]:accent-primary",
  priceField: "flex flex-col gap-1",
  priceLabel: "font-label-sm text-label-sm text-outline",
  money: "relative block",
  currency:
    "absolute left-3 top-1/2 -translate-y-1/2 font-body-sm text-body-sm text-outline pointer-events-none",
  moneyInput: adminStyles.input + " pl-7 py-2",
  perMillion: "col-span-2 md:col-span-1 pb-2 font-label-sm text-label-sm text-outline whitespace-nowrap",
  rowActions: "flex items-center gap-1 justify-end md:row-start-1 md:col-start-4",
  iconButton:
    "w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors disabled:opacity-30 disabled:pointer-events-none",
  removeButton:
    "w-9 h-9 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error-container/50 transition-colors",
  empty:
    "flex items-center gap-2 p-3 rounded-xl bg-[#fff4e6] text-[#d9480f] font-body-md text-body-md",
  footer: "flex flex-wrap items-center gap-space-sm pt-space-sm border-t border-outline-variant/30",
};
