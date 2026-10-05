export const styles = {
  root: "flex flex-col gap-space-md p-space-md rounded-2xl bg-surface-container-low/70 border border-outline-variant/40",
  title: "font-body-lg text-body-lg text-on-surface font-semibold",
  description: "font-body-sm text-body-sm text-on-surface-variant",
  fields: "grid grid-cols-2 md:grid-cols-5 gap-space-sm",
  field: "flex flex-col gap-1",
  label: "font-label-sm text-label-sm text-on-surface-variant font-medium",
  inputWrap: "relative block",
  prefix:
    "absolute left-3 top-1/2 -translate-y-1/2 font-body-sm text-body-sm text-outline pointer-events-none",
  suffix:
    "absolute right-3 top-1/2 -translate-y-1/2 font-body-sm text-body-sm text-outline pointer-events-none",
  input: (hasPrefix: boolean) =>
    "w-full rounded-xl bg-surface-container-lowest py-2 pr-7 font-body-md text-body-md text-on-surface border border-outline-variant/40 focus:outline-none focus:ring-4 focus:border-primary/50 focus:ring-primary-fixed/50 " +
    (hasPrefix ? "pl-7" : "pl-3"),
  hint: "font-label-sm text-label-sm text-outline",
  result: "flex flex-col lg:flex-row lg:items-end gap-space-md",
  numbers:
    "flex-1 grid grid-cols-2 md:grid-cols-4 gap-space-sm m-0 [&_dt]:font-label-sm [&_dt]:text-label-sm [&_dt]:text-outline [&_dd]:m-0 [&_dd]:font-headline-sm [&_dd]:text-headline-sm [&_dd]:text-on-surface [&_dd]:font-semibold",
  inr: "font-body-sm text-body-sm text-outline font-normal",
  apply:
    "inline-flex items-center justify-center gap-2 px-space-md py-2 rounded-full bg-inverse-surface text-inverse-on-surface font-label-md text-label-md font-semibold hover:bg-on-surface transition-colors whitespace-nowrap",
  invalid: "font-body-sm text-body-sm text-error",
};
