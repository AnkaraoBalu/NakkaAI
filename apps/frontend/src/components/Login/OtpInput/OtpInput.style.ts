export const styles = {
  root: "flex justify-center gap-2 sm:gap-2.5",
  box: (invalid: boolean, filled: boolean) =>
    "w-11 h-12 sm:w-12 sm:h-14 rounded-xl text-center font-headline-md text-headline-md text-on-surface border transition-all duration-150 focus:outline-none focus:ring-4 focus:bg-surface-container-lowest disabled:opacity-60 " +
    (invalid
      ? "border-error/60 bg-error-container/20 focus:border-error focus:ring-error-container/60"
      : filled
        ? "border-primary/30 bg-surface-container-lowest focus:border-primary/60 focus:ring-primary-fixed/50"
        : "border-transparent bg-surface-container-low focus:border-primary/50 focus:ring-primary-fixed/50"),
};
