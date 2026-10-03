export const styles = {
  root: "flex flex-col gap-space-md",
  divider:
    "flex items-center gap-space-sm font-label-sm text-label-sm text-outline before:h-px before:flex-1 before:bg-outline-variant/50 after:h-px after:flex-1 after:bg-outline-variant/50",
  buttons: "grid grid-cols-2 gap-space-sm",
  button:
    "inline-flex items-center justify-center gap-2 px-space-md py-2.5 rounded-full bg-surface-container-lowest border border-outline-variant/60 text-on-surface font-label-md text-label-md font-semibold shadow-sm hover:bg-surface-container-low hover:border-outline-variant hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-60 disabled:pointer-events-none",
  logo: "w-4 h-4 shrink-0",
  spinner: "material-symbols-outlined text-[16px] animate-spin",
};
