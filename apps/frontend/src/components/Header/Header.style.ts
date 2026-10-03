export const styles = {
  root: "fixed top-0 left-0 right-0 z-50 flex flex-col items-center pt-space-md px-margin-mobile md:px-margin pointer-events-none",
  bar: "pointer-events-auto h-16 w-full max-w-7xl mx-auto px-space-md md:px-space-lg flex items-center justify-between bg-surface-container-lowest/80 backdrop-blur-xl rounded-full shadow-[0_4px_24px_rgba(23,27,38,0.04)]",
  brand:
    "flex items-center gap-space-sm rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
  logo: "w-7 h-7 rounded-full object-contain shadow-sm",
  brandName:
    "font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold",
  nav: "hidden md:flex items-center gap-space-lg",
  navLink: (active: boolean) =>
    active
      ? "transition-colors text-primary font-medium"
      : "font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors",
  cta: "inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm font-medium hover:bg-primary-container transition-colors shadow-sm",
  mobileActions: "flex md:hidden items-center gap-space-sm",
  menuButton:
    "w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors",
  mobileMenu: (open: boolean) =>
    "pointer-events-auto md:hidden w-full mt-space-sm p-space-sm flex flex-col rounded-2xl bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_8px_32px_rgba(23,27,38,0.08)]" +
    (open ? "" : " hidden"),
  mobileNavLink: (active: boolean) =>
    "px-space-md py-3 rounded-xl font-body-md text-body-md transition-colors " +
    (active
      ? "text-primary font-medium bg-primary-fixed/30"
      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low"),
};
