// The admin session token, kept apart from the user's (api/session.ts) so the
// two never mix in one browser.
const TOKEN_KEY = "nakka.adminToken";

// Fired when the server says the admin session is no longer valid.
export const ADMIN_SIGNED_OUT_EVENT = "nakka:admin-signed-out";

// Storage can throw (private mode, blocked site data), so every access is guarded.
export const adminTokenStore = {
  get: () => {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set: (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      // The session still works until the page reloads.
    }
  },
  clear: () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      // Nothing to clear.
    }
  },
};
