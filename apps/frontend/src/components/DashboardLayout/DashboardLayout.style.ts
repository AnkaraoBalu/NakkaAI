export const styles = {
  root: "flex h-dvh overflow-hidden bg-background text-on-surface",
  main: "flex-1 min-w-0 flex flex-col",
  content: "flex-1 overflow-y-auto",
  contentInner:
    "w-full max-w-6xl mx-auto px-margin-mobile md:px-space-xl py-space-lg",
  backdrop: (open: boolean) =>
    "fixed inset-0 z-40 bg-inverse-surface/25 backdrop-blur-sm transition-opacity duration-200 lg:hidden " +
    (open ? "opacity-100" : "opacity-0 pointer-events-none"),
};
