import { cardStyles } from "../../styles/card.style";

// The centred card used by the admin sign-in and sign-up pages.
export const authCardStyles = {
  root: "relative min-h-dvh flex items-center justify-center px-margin-mobile py-space-xl bg-background overflow-hidden",
  card: "relative w-full max-w-md flex flex-col gap-space-md p-space-xl rounded-3xl bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_24px_64px_rgba(23,27,38,0.10)] border border-outline-variant/30 animate-auth-panel",
  brand: "flex items-center gap-space-sm",
  logo: "w-9 h-9 rounded-full object-contain shadow-sm",
  brandName:
    "font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold",
  tag: "px-2 py-0.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-semibold",
  header: "flex flex-col gap-1 mt-space-sm",
  title:
    "font-headline-md text-headline-md text-on-surface font-semibold tracking-tight",
  description: "font-body-md text-body-md text-on-surface-variant",
  error: cardStyles.error,
  submit:
    "mt-space-sm inline-flex items-center justify-center gap-2 w-full px-space-md py-3 rounded-full bg-primary text-on-primary font-label-md text-label-md font-semibold shadow-[0_4px_16px_rgba(0,97,148,0.22)] hover:bg-primary-container transition-colors disabled:opacity-60 disabled:pointer-events-none",
  spinner: cardStyles.spinner,
  setupLink:
    "flex items-center gap-space-sm p-space-md rounded-2xl bg-primary-fixed/60 text-on-primary-fixed-variant font-body-md text-body-md font-medium hover:bg-primary-fixed transition-colors",
  footnote: "text-center font-body-sm text-body-sm text-outline",
  link: "font-semibold text-primary hover:underline underline-offset-4",
  closed:
    "flex flex-col gap-space-sm p-space-md rounded-2xl bg-surface-container-low font-body-md text-body-md text-on-surface-variant",
};
