import { adminStyles } from "../../admin.style";

type Tone = "good" | "bad" | "off" | "unknown";

export const styles = {
  ...adminStyles,
  top: "flex items-center gap-space-md",
  logo: "w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-white font-headline-sm text-headline-sm font-bold shadow-sm",
  keyLine:
    "flex items-center gap-space-sm flex-wrap font-body-sm text-body-sm text-on-surface-variant",
  masked: "tracking-wider text-on-surface",
  envTag:
    "px-2 py-0.5 rounded-full bg-[#fff4e6] text-[#d9480f] font-label-sm text-label-sm",
  status: (tone: Tone) =>
    "shrink-0 px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-semibold " +
    {
      good: "bg-[#e6fcf5] text-[#087f5b]",
      bad: "bg-error-container text-on-error-container",
      off: "bg-surface-container-low text-outline",
      unknown: "bg-[#fff4e6] text-[#d9480f]",
    }[tone],
  meta: "grid grid-cols-2 gap-space-md font-body-sm text-body-sm text-on-surface m-0",
  metaLabel: "font-label-sm text-label-sm text-outline",
  checkError:
    "flex items-start gap-2 p-3 rounded-xl bg-error-container/50 text-on-error-container font-body-sm text-body-sm",
  form: "flex flex-col gap-space-sm",
  buttons: "flex flex-wrap items-center gap-space-sm",
};
