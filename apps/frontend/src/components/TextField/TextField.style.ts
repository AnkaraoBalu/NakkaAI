export const styles = {
  root: "flex flex-col gap-1.5",
  label: "font-label-md text-label-md text-on-surface-variant font-medium",
  inputWrap: "relative",
  input: (invalid: boolean, hasToggle: boolean) =>
    "w-full rounded-xl bg-surface-container-low px-space-md py-2.5 font-body-md text-body-md text-on-surface placeholder:text-outline border transition-all duration-150 focus:outline-none focus:bg-surface-container-lowest focus:ring-4 " +
    (invalid
      ? "border-error/60 focus:border-error focus:ring-error-container/60"
      : "border-transparent focus:border-primary/50 focus:ring-primary-fixed/50") +
    (hasToggle ? " pr-11" : ""),
  toggle:
    "absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container transition-colors",
  toggleIcon: "material-symbols-outlined text-[18px]",
  error: "flex items-center gap-1 font-label-sm text-label-sm text-error",
  errorIcon: "material-symbols-outlined text-[14px]",
};
