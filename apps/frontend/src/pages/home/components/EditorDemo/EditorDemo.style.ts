export const styles = {
  root: "mt-space-lg w-full max-w-6xl mx-auto",
  window:
    "w-full rounded-2xl bg-surface-container-lowest/90 backdrop-blur-2xl shadow-[0_24px_64px_-12px_rgba(35,0,92,0.08),0_8px_24px_-4px_rgba(0,97,148,0.06)] overflow-hidden transition-all duration-300",
  titleBar:
    "h-11 px-space-md bg-surface-container-low/70 flex items-center justify-between select-none",
  trafficLights: "flex items-center gap-2",
  trafficLight: {
    close: "w-3 h-3 rounded-full bg-[#ff5f56]",
    minimize: "w-3 h-3 rounded-full bg-[#ffbd2e]",
    zoom: "w-3 h-3 rounded-full bg-[#27c93f]",
  },
  title:
    "flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md",
  titleSeparator: "hidden sm:inline text-outline-variant",
  titleProject: "text-on-surface font-medium whitespace-nowrap",
  titlePath:
    "hidden sm:inline font-code-inline text-code-inline text-on-surface-variant",
  titleApp: "hidden sm:inline text-outline",
  windowActions: "flex items-center gap-space-xs text-outline",
  windowActionIcon: "material-symbols-outlined text-[18px]",
  body: "grid grid-cols-1 lg:grid-cols-12 min-h-[580px] bg-surface-container-lowest",
};
