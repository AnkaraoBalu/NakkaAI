export const styles = {
  root: "mt-space-xl pt-space-lg flex flex-col items-center w-full",
  eyebrow:
    "inline-flex items-center gap-1 px-space-md py-1 rounded-full bg-surface-container-lowest shadow-sm text-primary font-label-md text-label-md",
  title:
    "mt-space-sm font-headline-lg text-headline-lg text-center text-on-surface tracking-tight max-w-2xl font-semibold",
  toggle:
    "mt-space-md flex items-center p-1 rounded-full bg-surface-container-low shadow-sm",
  toggleButton: (active: boolean) =>
    "flex items-center gap-1.5 px-space-md py-1.5 rounded-full font-label-md text-label-md transition-all " +
    (active
      ? "bg-surface-container-lowest text-on-surface font-medium shadow-sm"
      : "text-on-surface-variant hover:text-on-surface"),
  saveBadge:
    "px-2 py-0.5 rounded-full bg-[#e6fcf5] text-[#087f5b] text-[10px] font-bold tracking-wide uppercase",
  grid: "mt-space-lg grid grid-cols-1 md:grid-cols-2 gap-space-lg w-full max-w-4xl items-stretch",
  freeCard:
    "flex flex-col justify-between p-space-lg rounded-2xl bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(23,27,38,0.03)] hover:shadow-md transition-all",
  proCard:
    "relative flex flex-col justify-between p-space-lg rounded-2xl bg-gradient-to-b from-surface-container-lowest via-surface-container-low/50 to-surface-container-lowest backdrop-blur-xl shadow-[0_16px_40px_rgba(0,97,148,0.08)] hover:shadow-lg transition-all",
  recommended:
    "absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-semibold tracking-wider uppercase shadow-sm",
  planName: "font-headline-sm text-headline-sm font-bold text-on-surface",
  planTagline: "mt-space-xs font-body-sm text-body-sm text-on-surface-variant",
  priceRow: "mt-space-md flex items-baseline gap-1",
  price: "font-display-xl text-display-xl font-bold text-on-surface",
  period: "font-body-md text-body-md text-on-surface-variant",
  features:
    "mt-space-md flex flex-col gap-2.5 font-body-sm text-body-sm text-on-surface",
  feature: "flex items-start gap-2.5",
  freeCheck: "material-symbols-outlined text-[18px] text-[#10b981] mt-0.5",
  proCheck: "material-symbols-outlined text-[18px] text-primary mt-0.5",
  footer: "mt-space-lg flex flex-col items-center gap-space-xs",
  freeButton:
    "w-full inline-flex items-center justify-center px-space-md py-3 rounded-full bg-surface-container-low hover:bg-surface-container-high text-on-surface font-label-md text-label-md font-semibold transition-all",
  proButton:
    "w-full inline-flex items-center justify-center gap-2 px-space-md py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold transition-all shadow-[0_4px_16px_rgba(0,97,148,0.22)]",
  note: "font-label-sm text-label-sm text-outline mt-1",
};
