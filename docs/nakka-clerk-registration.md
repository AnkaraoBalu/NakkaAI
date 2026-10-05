# Nakka registration with Clerk

New registrations use Clerk for passwords, email verification codes, email delivery,
and account recovery. The frontend does not call the SMTP OTP endpoints.

The signup steps are details → password → email verification. Nakka first checks
that the email and username are available. Clerk creates the signup attempt and
sends the verification code. After verification, the browser activates the Clerk
session and goes to `/sso-callback/complete`. The backend verifies the Clerk token
and exchanges it for a Nakka session at `POST /api/auth/oauth/clerk`.

The backend stores the stable Clerk user ID in `users.clerk_user_id`, which was
already added by migration `004_add_clerk_oauth.sql`. Email-only accounts do not
need a Google/GitHub identity. Their Nakka username is collected as signup metadata,
validated on the server, and made unique if another signup claims it first.
Metadata is never used as proof of email ownership.

## Configuration

- Frontend: `VITE_CLERK_PUBLISHABLE_KEY` at build time.
- Backend: matching `CLERK_SECRET_KEY` from the same Clerk instance.
- Backend: `CORS_ORIGINS` must contain the exact frontend origins, including
  `https://nakka.in` and `https://www.nakka.in` when both are served.
- Clerk: enable email signup, email verification codes, password signup and sign-in,
  and optional first/last names. Google/GitHub can stay enabled.
- Clerk password rules are authoritative; errors from Clerk appear in the form.
- SMTP variables are unnecessary for the new registration UI. The old backend OTP
  routes remain for compatibility but are not used by this UI.

Production and development Clerk users are separate. Local development should use
matching test keys; production should use matching live keys. Deploy the backend
before the frontend, since the new frontend calls `/api/auth/signup/check`.

## Existing accounts

The standard sign-in form uses Clerk and handles verification and password recovery.
The “Use existing account” option keeps the previous username/email and password
login for users whose password is stored in Nakka. Existing password hashes are not
imported into Clerk or removed. A verified Clerk account with the same email links
to the existing Nakka account and preserves its password and data.

Nakka's Settings password action still sets an optional Nakka password, used by the
existing-account login. It does not change the Clerk password; reset that through
the standard sign-in form. Dashboard and VS Code extension tokens remain Nakka
sessions. Authentication through either form works for the extension handoff.

## Verification before release

1. Register a fresh email: enter details and password, receive the Clerk code,
   verify it, and reach the dashboard.
2. Sign out and sign in with the same email through the standard form.
3. Check wrong codes, resend, expired codes, password-policy errors, and recovery.
4. Confirm Google login and signup still reach the dashboard.
5. Confirm an existing Nakka password account still works through “Use existing account”.
6. Start login from the VS Code extension and confirm it returns to the extension handoff.

Live inbox delivery and complete browser authentication require real test accounts;
unit tests do not prove those production behaviors.

Clerk reference: https://clerk.com/docs/guides/development/custom-flows/authentication/email-password
