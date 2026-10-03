export const styles = {
  root: "hidden lg:flex lg:col-span-2 flex-col bg-surface-container-low/40 p-space-sm select-none",
  header: "flex items-center justify-between pb-space-xs px-2 text-outline",
  headerLabel:
    "font-label-sm text-label-sm tracking-wider uppercase font-semibold text-on-surface-variant",
  project:
    "flex items-center gap-1 px-2 py-1 text-on-surface font-label-md text-label-md font-semibold",
  tree: "flex flex-col gap-0.5 mt-1 text-on-surface-variant font-body-sm text-body-sm pl-2",
  nested: "flex flex-col gap-0.5 pl-4",
  row: "flex items-center gap-1.5 px-2 py-1 rounded hover:bg-surface-container-high/60 cursor-pointer",
  activeRow:
    "flex items-center gap-1.5 px-2 py-1 rounded bg-primary-fixed/60 text-on-primary-fixed font-medium",
  fileName: "font-code-inline text-code-inline",
  folderIcon: "material-symbols-outlined text-[15px] text-primary",
  fileIcon: "material-symbols-outlined text-[14px] text-outline",
  activeFileIcon: "material-symbols-outlined text-[14px] text-primary",
};
