export const styles = {
  root: "relative flex flex-col gap-2 m-0",
  plot: "relative border-b border-outline-variant/50",
  max: "absolute -top-1 left-0 font-label-sm text-label-sm text-outline",
  bars: "absolute inset-0 top-5 flex items-end gap-[3px]",
  column: "group flex-1 h-full flex items-end cursor-default",
  bar: (filled: boolean) =>
    "w-full rounded-t-md transition-colors " +
    (filled
      ? "bg-primary/75 group-hover:bg-primary"
      : "bg-surface-container-high"),
  labels: "flex gap-[3px]",
  label:
    "flex-1 min-w-0 overflow-visible whitespace-nowrap font-label-sm text-label-sm text-outline",
  empty:
    "absolute inset-x-0 top-1/3 text-center font-body-sm text-body-sm text-outline",
};
