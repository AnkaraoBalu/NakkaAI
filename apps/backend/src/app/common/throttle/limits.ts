// Per-client-address limits for routes attackers aim at: password guessing,
// email sending (protects the SMTP quota) and sign-in hand-offs. Use as
// @Throttle(LIMITS.login). Everything else gets the global default.
const per = (limit: number, minutes: number) => ({
  default: { limit, ttl: minutes * 60_000 },
});

export const LIMITS = {
  // Password sign-in (users and admins).
  login: per(10, 1),
  // Sends an email.
  sendEmail: per(5, 10),
  // Other sign-up steps and account security changes.
  sensitive: per(20, 10),
  // Creating the first admin.
  setup: per(5, 60),
  // The VS Code sign-in hand-off.
  extensionAuth: per(30, 1),
};
