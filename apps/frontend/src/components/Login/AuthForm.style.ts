// Shared by LoginForm and SignupForm.
export const formStyles = {
  form: "flex flex-col gap-space-lg",
  fields: "flex flex-col gap-space-md border-0 p-0 m-0 min-w-0",
  submit:
    "w-full inline-flex items-center justify-center gap-2 px-space-md py-3 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md font-semibold shadow-[0_4px_16px_rgba(0,97,148,0.22)] hover:shadow-[0_6px_20px_rgba(0,97,148,0.28)] hover:-translate-y-px active:translate-y-0 transition-all disabled:opacity-70 disabled:pointer-events-none",
  spinner: "material-symbols-outlined text-[18px] animate-spin",
  errorBanner:
    "flex items-start gap-2 p-3 rounded-xl bg-error-container/60 text-on-error-container font-body-sm text-body-sm",
  switchText: "text-center font-body-sm text-body-sm text-on-surface-variant",
  switchButton:
    "ml-1 font-semibold text-primary hover:underline underline-offset-4 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary",
};
