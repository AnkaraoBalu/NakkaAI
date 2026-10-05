export const styles = {
  root: "flex flex-col gap-space-lg",
  greeting: "flex flex-col gap-space-xs",
  title:
    "font-headline-lg text-headline-lg-mobile sm:text-headline-lg text-on-surface tracking-tight",
  subtitle: "font-body-lg text-body-lg text-on-surface-variant",
  section: "flex flex-col gap-space-md",
  sectionTitle:
    "font-headline-sm text-headline-sm text-on-surface font-semibold",
  steps: "grid grid-cols-1 md:grid-cols-3 gap-space-md",
  step: "flex flex-col gap-space-sm p-space-lg rounded-2xl bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(23,27,38,0.04)] hover:shadow-md transition-shadow",
  stepTop: "flex items-center justify-between",
  stepIcon:
    "w-10 h-10 rounded-xl bg-primary-fixed/50 text-primary flex items-center justify-center",
  stepNumber: "font-label-sm text-label-sm text-outline",
  stepTitle: "font-headline-sm text-headline-sm text-on-surface font-semibold",
  stepText: "flex-1 font-body-sm text-body-sm text-on-surface-variant",
  stepAction:
    "self-start inline-flex items-center gap-1 font-label-md text-label-md font-semibold text-primary hover:underline underline-offset-4",
  stats: "grid grid-cols-1 sm:grid-cols-3 gap-space-md",
  error:
    "p-3 rounded-xl bg-error-container/60 text-on-error-container font-body-md text-body-md",
  loading: "flex items-center gap-2 text-outline font-body-md text-body-md",
};
