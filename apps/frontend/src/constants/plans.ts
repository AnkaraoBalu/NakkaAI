import { LEGAL_CONTACT_EMAIL } from "./legal";

// Paid plans are assigned by hand for now, so "Upgrade" opens an email.
export const UPGRADE_URL = `mailto:${LEGAL_CONTACT_EMAIL}?subject=${encodeURIComponent(
  "Upgrade my Nakka plan",
)}`;

export const FREE_PLAN_ID = "free";
