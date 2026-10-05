const cell = (align: "left" | "right" = "left", hideOnMobile = false) =>
  (align === "right" ? "text-right " : "text-left ") +
  (hideOnMobile ? "hidden md:table-cell " : "");

export const styles = {
  scroll: "-mx-space-lg overflow-x-auto",
  table: "w-full border-collapse",
  th: (align?: "left" | "right", hideOnMobile?: boolean) =>
    cell(align, hideOnMobile) +
    "px-space-lg pb-2 font-label-sm text-label-sm uppercase tracking-wider text-outline font-semibold whitespace-nowrap",
  tr: (clickable: boolean) =>
    "border-t border-outline-variant/30 " +
    (clickable
      ? "cursor-pointer hover:bg-surface-container-low focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:-outline-offset-2"
      : ""),
  td: (align?: "left" | "right", hideOnMobile?: boolean) =>
    cell(align, hideOnMobile) +
    "px-space-lg py-3 font-body-md text-body-md text-on-surface align-middle",
  empty:
    "py-space-lg text-center font-body-md text-body-md text-outline",
};
