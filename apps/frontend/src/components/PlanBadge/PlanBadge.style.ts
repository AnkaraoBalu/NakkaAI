export const styles = {
  root: (paid: boolean) =>
    "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold whitespace-nowrap " +
    (paid
      ? "bg-primary-fixed text-on-primary-fixed-variant"
      : "bg-surface-container-low text-on-surface-variant"),
};
