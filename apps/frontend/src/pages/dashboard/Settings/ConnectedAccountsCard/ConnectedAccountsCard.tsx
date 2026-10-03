import { useState } from "react";
import type {
  AccountSecurity,
  Identity,
  IdentityProvider,
} from "@nakka/types/users";
import { accountApi } from "../../../../api/account";
import { OAUTH_ENABLED, useOAuth } from "../../../../api-hooks/auth";
import ProviderLogo from "../../../../components/ProviderLogo";
import { styles } from "./ConnectedAccountsCard.style";

const PROVIDERS: { id: IdentityProvider; name: string }[] = [
  { id: "google", name: "Google" },
  { id: "github", name: "GitHub" },
];

interface ConnectedAccountsCardProps {
  security: AccountSecurity;
  accountEmail: string;
  onChange: (security: AccountSecurity) => void;
}

export default function ConnectedAccountsCard({
  security,
  accountEmail,
  onChange,
}: ConnectedAccountsCardProps) {
  const startOAuth = useOAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  // Removing the only sign-in method would lock the person out.
  const isLastMethod =
    !security.hasPassword && security.identities.length === 1;

  async function connect(provider: IdentityProvider) {
    setBusy(provider);
    setError("");
    try {
      await startOAuth(provider, "connect");
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Couldn't start connecting.",
      );
      setBusy(null);
    }
  }

  async function disconnect(identity: Identity) {
    setBusy(identity.id);
    setError("");
    try {
      onChange(await accountApi.disconnect(identity.id));
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Couldn't disconnect.",
      );
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className={styles.card} aria-labelledby="connections-title">
      <div className={styles.header}>
        <h2 id="connections-title" className={styles.title}>
          Connected accounts
        </h2>
        <p className={styles.description}>
          Sign in with any of these. They can use a different email from your
          Nakka account.
        </p>
      </div>
      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      <ul className={styles.list}>
        {PROVIDERS.map(({ id, name }) => {
          const connected = security.identities.filter(
            (identity) => identity.provider === id,
          );
          return (
            <li key={id} className={styles.row}>
              <div className={styles.provider}>
                <span className={styles.logoBox} aria-hidden="true">
                  <ProviderLogo provider={id} className={styles.logo} />
                </span>
                <div className="min-w-0">
                  <p className={styles.name}>
                    {name}
                    {connected.length > 0 && (
                      <span className={styles.badge}>
                        <span className="material-symbols-outlined text-[12px]">
                          link
                        </span>
                        Connected
                      </span>
                    )}
                  </p>
                  {connected.length === 0 && (
                    <p className={styles.detail}>Not connected</p>
                  )}
                  {connected.map((identity) => (
                    <div key={identity.id}>
                      <p className={styles.detail}>
                        {identity.email ?? `${name} account`}
                      </p>
                      {identity.email === accountEmail && (
                        <p className={styles.hint}>
                          Uses your account email, so signing in with {name}{" "}
                          reconnects it.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {connected.length > 0 ? (
                connected.map((identity) => (
                  <button
                    key={identity.id}
                    type="button"
                    className={styles.dangerButton}
                    onClick={() => disconnect(identity)}
                    disabled={busy !== null || isLastMethod}
                    title={
                      isLastMethod
                        ? "Add a password first so you can still sign in."
                        : undefined
                    }
                  >
                    {busy === identity.id && (
                      <span className={styles.spinner} aria-hidden="true">
                        progress_activity
                      </span>
                    )}
                    Disconnect
                  </button>
                ))
              ) : (
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => connect(id)}
                  disabled={busy !== null || !OAUTH_ENABLED}
                  title={
                    OAUTH_ENABLED
                      ? undefined
                      : `${name} sign-in isn't set up yet.`
                  }
                >
                  {busy === id && (
                    <span className={styles.spinner} aria-hidden="true">
                      progress_activity
                    </span>
                  )}
                  Connect
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {isLastMethod && (
        <p className={styles.hint}>
          This is your only way to sign in. Add a password above before
          disconnecting it.
        </p>
      )}
    </section>
  );
}
