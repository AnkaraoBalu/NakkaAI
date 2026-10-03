export const styles = {
  overlay: (visible: boolean) =>
    "fixed inset-0 z-[60] flex items-center justify-center p-margin-mobile bg-inverse-surface/25 backdrop-blur-sm transition-opacity duration-200 " +
    (visible ? "opacity-100" : "opacity-0"),
  dialog: (visible: boolean) =>
    "relative w-full max-w-md max-h-[calc(100dvh-2.5rem)] overflow-y-auto overscroll-contain rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_24px_64px_-12px_rgba(35,0,92,0.18),0_8px_24px_-4px_rgba(0,97,148,0.12)] transition-all duration-200 ease-out " +
    (visible
      ? "opacity-100 scale-100 translate-y-0"
      : "opacity-0 scale-95 translate-y-3"),
  glow: "pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary-fixed/40 via-secondary-fixed/20 to-transparent",
  closeButton:
    "absolute top-space-md right-space-md z-10 w-8 h-8 rounded-full flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-low transition-colors",
  closeIcon: "material-symbols-outlined text-[20px]",
  panel: "relative p-space-lg sm:p-space-xl animate-auth-panel",
  header: "flex flex-col items-center text-center mb-space-lg",
  logo: "w-11 h-11 rounded-full object-contain shadow-sm",
  title:
    "mt-space-md font-headline-lg text-headline-lg-mobile text-on-surface tracking-tight",
  subtitle: "mt-space-xs font-body-sm text-body-sm text-on-surface-variant",
};
