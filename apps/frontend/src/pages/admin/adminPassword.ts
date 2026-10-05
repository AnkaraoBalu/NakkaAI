// The same rules the backend applies to admin passwords
// (apps/backend/src/app/features/admin/admin-password.ts).
export const ADMIN_PASSWORD_MIN = 12;

export function adminPasswordError(password: string): string {
  if (password.length < ADMIN_PASSWORD_MIN)
    return `Use at least ${ADMIN_PASSWORD_MIN} characters.`;
  if (password.length > 128) return "Use at most 128 characters.";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password))
    return "Include a letter and a number.";
  return "";
}

// Field errors for a new admin account (sign-up page and "Add admin").
export function validateAdminAccount(values: {
  name: string;
  email: string;
  password: string;
  confirm: string;
}) {
  return {
    name: values.name.trim() ? "" : "Enter a name.",
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) ? "" : "Enter a valid email.",
    password: adminPasswordError(values.password),
    confirm: !values.confirm
      ? "Re-enter the password."
      : values.confirm === values.password
        ? ""
        : "Passwords don't match.",
  };
}
