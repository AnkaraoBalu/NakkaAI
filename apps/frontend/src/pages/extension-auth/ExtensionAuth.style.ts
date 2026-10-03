export const styles = {
  root: "min-h-dvh flex items-center justify-center p-margin-mobile bg-background",
  card: "w-full max-w-md flex flex-col items-center text-center gap-space-md p-space-xl rounded-2xl bg-surface-container-lowest shadow-[0_24px_64px_-12px_rgba(35,0,92,0.12)] animate-auth-panel",
  pair: "flex items-center gap-space-sm",
  logo: "w-11 h-11 rounded-full object-contain shadow-sm",
  vscode:
    "w-11 h-11 rounded-full bg-[#0065a9] text-white flex items-center justify-center shadow-sm",
  link: "material-symbols-outlined text-[20px] text-outline",
  title: "font-headline-md text-headline-md text-on-surface font-semibold",
  message: "font-body-md text-body-md text-on-surface-variant",
  account:
    "w-full flex items-center gap-space-sm p-space-sm rounded-xl bg-surface-container-low text-left",
  avatar:
    "w-10 h-10 shrink-0 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-md text-label-md font-semibold",
  accountName:
    "block font-body-md text-body-md text-on-surface font-medium truncate",
  accountEmail:
    "block font-body-sm text-body-sm text-on-surface-variant truncate",
  actions: "w-full flex flex-col gap-space-sm",
  primary:
    "w-full inline-flex items-center justify-center gap-2 px-space-md py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-[0_4px_16px_rgba(0,97,148,0.22)] hover:bg-primary-container transition-all disabled:opacity-70 disabled:pointer-events-none",
  secondary:
    "w-full inline-flex items-center justify-center gap-2 px-space-md py-3 rounded-full bg-surface-container-low text-on-surface font-label-md text-label-md font-semibold hover:bg-surface-container-high transition-colors",
  spinner: "material-symbols-outlined text-[18px] animate-spin",
  bigSpinner: "material-symbols-outlined text-[28px] text-primary animate-spin",
  errorIcon:
    "w-12 h-12 rounded-full bg-error-container/60 text-error flex items-center justify-center",
  doneIcon:
    "w-12 h-12 rounded-full bg-[#e6fcf5] text-[#10b981] flex items-center justify-center",
  note: "font-label-sm text-label-sm text-outline",
};
