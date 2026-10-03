import { formStyles } from "../../AuthForm.style";

export const styles = {
  ...formStyles,
  intro: "text-center font-body-md text-body-md text-on-surface-variant",
  email: "font-semibold text-on-surface break-all",
  changeButton: formStyles.switchButton,
  fieldError:
    "flex items-center justify-center gap-1 font-label-sm text-label-sm text-error",
  notice:
    "flex items-center justify-center gap-1 font-label-sm text-label-sm text-[#10b981]",
  noticeIcon: "material-symbols-outlined text-[14px]",
  resendRow: "text-center font-body-sm text-body-sm text-on-surface-variant",
  resendButton:
    "ml-1 font-semibold text-primary hover:underline underline-offset-4 disabled:text-outline disabled:no-underline disabled:cursor-default",
  expiry: "text-center font-label-sm text-label-sm text-outline",
};
