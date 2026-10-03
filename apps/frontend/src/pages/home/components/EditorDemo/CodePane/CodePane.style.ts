export type LineKind = "context" | "normal" | "removed" | "added";

export const styles = {
  root: "lg:col-span-5 flex flex-col bg-surface-container-lowest overflow-hidden",
  tabs: "h-9 flex items-center bg-surface-container-low/60 px-space-xs overflow-x-auto",
  activeTab:
    "flex items-center gap-2 px-space-sm py-1 bg-surface-container-lowest rounded-t text-on-surface font-code-inline text-code-inline shadow-sm",
  tab: "flex items-center gap-2 px-space-sm py-1 text-on-surface-variant font-code-inline text-code-inline hover:bg-surface-container-high/50 cursor-pointer",
  breadcrumbs:
    "h-7 px-space-md bg-surface-container-lowest flex items-center gap-1 text-outline font-label-sm text-label-sm",
  code: "flex-1 p-space-sm font-code-inline text-[12px] leading-5 text-on-surface overflow-auto font-normal",
  line: {
    context: "flex items-start text-outline",
    normal: "flex items-start",
    removed:
      "flex items-start bg-error-container/40 text-on-error-container my-0.5 py-0.5 rounded",
    added:
      "flex items-start bg-[#e6fcf5] text-[#087f5b] my-0.5 py-0.5 rounded font-medium",
  } satisfies Record<LineKind, string>,
  lineNumber: {
    context: "w-7 text-right select-none pr-3 opacity-60",
    normal: "w-7 text-right select-none pr-3 text-outline opacity-60",
    removed: "w-7 text-right select-none pr-3 text-error font-medium",
    added: "w-7 text-right select-none pr-3 text-[#12b886] font-bold",
  } satisfies Record<LineKind, string>,
  removedText: "line-through decoration-error/50",
  indent: { 0: "", 1: "pl-4", 2: "pl-8" },
  keyword: "text-secondary font-medium",
  string: "text-primary",
  functionName: "text-primary font-medium",
};
