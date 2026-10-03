export const styles = {
  root: "flex items-center justify-center gap-2 mb-space-lg",
  step: "flex items-center gap-2",
  dot: (state: "done" | "current" | "upcoming") =>
    "w-6 h-6 rounded-full flex items-center justify-center font-label-sm text-label-sm font-semibold transition-all duration-300 " +
    (state === "done"
      ? "bg-[#10b981] text-white"
      : state === "current"
        ? "bg-primary text-on-primary shadow-[0_2px_8px_rgba(0,97,148,0.3)]"
        : "bg-surface-container-high text-outline"),
  doneIcon: "material-symbols-outlined text-[14px]",
  label: (state: "done" | "current" | "upcoming") =>
    "hidden sm:inline font-label-sm text-label-sm transition-colors " +
    (state === "upcoming" ? "text-outline" : "text-on-surface font-semibold"),
  line: (done: boolean) =>
    "w-6 sm:w-8 h-px transition-colors duration-300 " +
    (done ? "bg-[#10b981]" : "bg-outline-variant/60"),
};
