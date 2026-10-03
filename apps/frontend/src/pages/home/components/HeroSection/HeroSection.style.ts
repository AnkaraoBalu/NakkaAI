export const styles = {
  root: "relative w-full flex flex-col items-center",
  glow: "absolute -top-12 left-1/2 -translate-x-1/2 w-[840px] h-[340px] bg-gradient-to-b from-primary-fixed/30 via-secondary-fixed/20 to-transparent blur-3xl pointer-events-none -z-10",
  title:
    "mt-space-md font-display-xl text-display-xl text-center text-on-surface tracking-tight max-w-4xl",
  titleAccent:
    "bg-gradient-to-r from-primary via-primary-container to-secondary bg-clip-text text-transparent",
  subtitle:
    "mt-space-sm font-body-lg text-body-lg text-center text-on-surface-variant max-w-2xl leading-relaxed",
  actions:
    "mt-space-lg flex flex-col sm:flex-row items-center justify-center gap-space-md w-full max-w-2xl",
  installButton:
    "w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md hover:bg-on-surface transition-all shadow-[0_4px_16px_rgba(23,27,38,0.14)]",
  marketplaceButton:
    "w-full sm:w-auto inline-flex items-center justify-center gap-space-xs px-space-lg py-3 rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-all shadow-sm",
  copyButton:
    "group w-full sm:w-auto inline-flex items-center gap-space-xs px-space-md py-3 rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface transition-all shadow-sm",
  copyText: "font-code-inline text-code-inline select-all text-on-surface",
  copyIcon:
    "material-symbols-outlined text-[16px] text-outline group-hover:text-primary transition-colors",
  prompts:
    "mt-space-md flex flex-wrap items-center justify-center gap-space-xs max-w-3xl",
  promptsLabel: "font-label-sm text-label-sm text-on-surface-variant mr-1",
  promptPill:
    "inline-flex items-center gap-1 px-3 py-1 rounded-full bg-surface-container-lowest/90 hover:bg-primary-fixed/40 transition-colors shadow-sm text-on-surface font-body-sm text-body-sm",
  promptIcon: {
    primary: "material-symbols-outlined text-[14px] text-primary",
    secondary: "material-symbols-outlined text-[14px] text-secondary",
  },
};
