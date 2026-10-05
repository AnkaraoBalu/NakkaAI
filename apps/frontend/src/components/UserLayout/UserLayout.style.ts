export const styles = {
  openInVsCode: (collapsed: boolean) =>
    "flex items-center gap-2 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-[0_4px_16px_rgba(0,97,148,0.22)] hover:bg-primary-container transition-all " +
    (collapsed
      ? "lg:w-11 lg:h-11 lg:justify-center lg:self-center px-space-md py-2.5 lg:p-0"
      : "px-space-md py-2.5"),
  plan: "hidden sm:inline-flex rounded-full hover:opacity-80 transition-opacity",
  install:
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-on-surface transition-colors shadow-sm",
};
