export const styles = {
  root: "flex flex-col gap-2",
  top: "flex items-baseline justify-between gap-space-sm",
  label: "font-body-md text-body-md text-on-surface font-semibold",
  count: (usedUp: boolean) =>
    "font-body-sm text-body-sm font-semibold " +
    (usedUp ? "text-error" : "text-on-surface"),
  track: "h-2.5 w-full rounded-full bg-surface-container-high overflow-hidden",
  fill: (percent: number) =>
    "h-full rounded-full transition-[width] duration-500 ease-out " +
    (percent >= 100
      ? "bg-error"
      : percent >= 80
        ? "bg-[#e8590c]"
        : "bg-primary"),
  bottom:
    "flex items-center justify-between gap-space-sm font-label-sm text-label-sm text-outline",
  left: (usedUp: boolean) => (usedUp ? "text-error font-semibold" : ""),
};
