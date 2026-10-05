export const styles = {
  root: "inline-flex items-center gap-0.5 p-0.5 rounded-full bg-surface-container-low",
  option: (active: boolean) =>
    "px-3 py-1 rounded-full font-label-md text-label-md transition-colors " +
    (active
      ? "bg-surface-container-lowest text-primary font-semibold shadow-sm"
      : "text-on-surface-variant hover:text-on-surface"),
};
