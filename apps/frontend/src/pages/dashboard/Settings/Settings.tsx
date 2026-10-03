import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../../api-hooks/auth";
import { useAccountSecurity } from "../../../api-hooks/account";
import ProfileCard from "./ProfileCard";
import PasswordCard from "./PasswordCard";
import ConnectedAccountsCard from "./ConnectedAccountsCard";
import { styles } from "./Settings.style";

const providerNames: Record<string, string> = {
  google: "Google",
  github: "GitHub",
};

export default function Settings() {
  const { user } = useAuth();
  const { data, setData, error } = useAccountSecurity();
  const [params, setParams] = useSearchParams();
  // Coming back from connecting Google/GitHub (?connected=google).
  const [connected] = useState(
    () => providerNames[params.get("connected") ?? ""],
  );
  useEffect(() => {
    if (params.has("connected")) setParams({}, { replace: true });
  }, [params, setParams]);

  if (!user) return null;

  return (
    <div className={styles.root}>
      <p className={styles.intro}>
        Your profile and the ways you sign in to Nakka.
      </p>
      {connected && (
        <p className={styles.notice} role="status">
          <span className="material-symbols-outlined text-[18px]">
            check_circle
          </span>
          {connected} is now connected to your account.
        </p>
      )}
      <ProfileCard user={user} />
      {error && <p className={styles.error}>{error}</p>}
      {!data && !error && (
        <p className={styles.loading}>
          <span className="material-symbols-outlined text-[18px] animate-spin">
            progress_activity
          </span>
          Loading your sign-in methods…
        </p>
      )}
      {data && (
        <>
          <PasswordCard hasPassword={data.hasPassword} onSaved={setData} />
          <ConnectedAccountsCard
            security={data}
            accountEmail={user.email}
            onChange={setData}
          />
        </>
      )}
    </div>
  );
}
